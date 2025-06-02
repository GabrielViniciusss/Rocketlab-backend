import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { AddItemToCartDto } from '../cart/dto/add-item-to-cart';
import { UpdateCartItemQuantityDto } from '../cart/dto/update-cart-item-quantity';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  public async getOrCreateCartByUserId(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }
    return cart;
  }

  async getCartContents(userId: number) {
    const cart = await this.getOrCreateCartByUserId(userId);

    let total = 0;
    if (cart.items && cart.items.length > 0) {
      total = cart.items.reduce((acc, item) => {
        if (item.product && typeof item.product.price === 'number') {
          return acc + item.quantity * item.product.price;
        }
        return acc;
      }, 0);
    }

    const roundedTotal = parseFloat(total.toFixed(2));

    return {
      ...cart,
      total: roundedTotal,
    };
  }

  async checkout(userId: number) {
    const currentCartWithDetails = await this.getCartContents(userId);

    if (
      !currentCartWithDetails.items ||
      currentCartWithDetails.items.length === 0
    ) {
      throw new BadRequestException('Cannot checkout an empty cart.');
    }

    const orderSummary = {
      items: [...currentCartWithDetails.items],
      total: currentCartWithDetails.total,
      checkoutDate: new Date(),
    };

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: currentCartWithDetails.id,
      },
    });
    return {
      message: 'Checkout successful! Thank you for your purchase.',
      orderSummary: orderSummary,
    };
  }

  async addItem(userId: number, addItemDto: AddItemToCartDto) {
    const { productId, quantity } = addItemDto;
    await this.productsService.findOne(productId);
    const cart = await this.getOrCreateCartByUserId(userId);
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (existingCartItem) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedItem = await this.prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: { product: true },
      });
      return this.getOrCreateCartByUserId(userId);
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
      });
      return this.getOrCreateCartByUserId(userId);
    }
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.getOrCreateCartByUserId(userId);
    const cartItemToDelete = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (!cartItemToDelete) {
      throw new NotFoundException(
        `Product with ID "${productId}" not found in cart.`,
      );
    }
    await this.prisma.cartItem.delete({
      where: {
        id: cartItemToDelete.id,
      },
    });
    return this.getOrCreateCartByUserId(userId);
  }

  async updateItemQuantity(
    userId: number,
    productId: number,
    updateDto: UpdateCartItemQuantityDto,
  ) {
    const { quantity } = updateDto;
    const cart = await this.getOrCreateCartByUserId(userId);
    const cartItemToUpdate = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (!cartItemToUpdate) {
      throw new NotFoundException(
        `Product with ID "${productId}" not found in cart, cannot update quantity.`,
      );
    }
    await this.prisma.cartItem.update({
      where: {
        id: cartItemToUpdate.id,
      },
      data: {
        quantity: quantity,
      },
    });
    return this.getOrCreateCartByUserId(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCartByUserId(userId);
    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    return this.getOrCreateCartByUserId(userId);
  }
}
