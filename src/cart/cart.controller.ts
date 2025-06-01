import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto } from '../cart/dto/add-item-to-cart';
import { UpdateCartItemQuantityDto } from '../cart/dto/update-cart-item-quantity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Endpoint para obter o carrinho de um usuário específico
  @Get(':userId')
  @ApiOperation({ summary: "Get a user's shopping cart" })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiResponse({ status: 200, description: "Return the user's cart." })
  @ApiResponse({
    status: 404,
    description: 'User not found (if cart creation depends on user existence).',
  })
  async getUserCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getOrCreateCartByUserId(userId);
  }

  @Post(':userId/items')
  @ApiOperation({ summary: 'Add an item to the shopping cart' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiBody({ type: AddItemToCartDto })
  @ApiResponse({ status: 201, description: 'Item successfully added to cart.' })
  @ApiResponse({ status: 404, description: 'User or Product not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., validation error).',
  })
  @HttpCode(HttpStatus.CREATED)
  async addItemToCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() addItemToCartDto: AddItemToCartDto,
  ) {
    return this.cartService.addItem(userId, addItemToCartDto);
  }

  @Patch(':userId/items/:productId')
  @ApiOperation({ summary: 'Update quantity of an item in the cart' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product in the cart',
    type: Number,
  })
  @ApiBody({ type: UpdateCartItemQuantityDto })
  @ApiResponse({
    status: 200,
    description: 'Item quantity successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'User, Cart, or Product item not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateItemQuantity(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateDto: UpdateCartItemQuantityDto,
  ) {
    return this.cartService.updateItemQuantity(userId, productId, updateDto);
  }

  @Delete(':userId/items/:productId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: Number })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product to remove from the cart',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Item successfully removed from cart.',
  })
  @ApiResponse({
    status: 404,
    description: 'User, Cart, or Product item not found.',
  })
  @HttpCode(HttpStatus.OK)
  async removeItemFromCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: "Clear all items from a user's cart" })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user whose cart to clear',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Cart successfully cleared.' })
  @ApiResponse({ status: 404, description: 'User or Cart not found.' })
  @HttpCode(HttpStatus.OK)
  async clearUserCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.clearCart(userId);
  }
}
