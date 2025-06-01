/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dto/add-item-to-cart';
import { UpdateCartItemQuantityDto } from './dto/update-cart-item-quantity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; // Para usar AuthGuard('jwt')

@ApiTags('Cart')
@ApiBearerAuth('access-token') // Aplica a necessidade de Bearer token a todos os endpoints deste controller no Swagger
@UseGuards(AuthGuard('jwt')) // Protege todos os endpoints deste controller com a estratégia JWT
@Controller('cart') // Rota base continua /cart
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get the authenticated user's shopping cart" })
  @ApiResponse({ status: 200, description: "Return the user's cart." })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getUserCart(@Request() req) {
    const userId = req.user.userId;
    return this.cartService.getOrCreateCartByUserId(userId);
  }

  @Post('items')
  @ApiOperation({
    summary: "Add an item to the authenticated user's shopping cart",
  })
  @ApiBody({ type: AddItemToCartDto })
  @ApiResponse({ status: 201, description: 'Item successfully added to cart.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., validation error).',
  })
  @HttpCode(HttpStatus.CREATED)
  async addItemToCart(
    @Request() req,
    @Body() addItemToCartDto: AddItemToCartDto,
  ) {
    const userId = req.user.userId;
    return this.cartService.addItem(userId, addItemToCartDto);
  }

  @Patch('items/:productId')
  @ApiOperation({
    summary: "Update quantity of an item in the authenticated user's cart",
  })
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
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Cart or Product item not found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateItemQuantity(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateDto: UpdateCartItemQuantityDto,
  ) {
    const userId = req.user.userId;
    return this.cartService.updateItemQuantity(userId, productId, updateDto);
  }

  @Delete('items/:productId')
  @ApiOperation({
    summary: "Remove an item from the authenticated user's cart",
  })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product to remove from the cart',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Item successfully removed from cart.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Cart or Product item not found.',
  })
  @HttpCode(HttpStatus.OK)
  async removeItemFromCart(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req.user.userId;
    return this.cartService.removeItem(userId, productId);
  }

  @Delete()
  @ApiOperation({
    summary: "Clear all items from the authenticated user's cart",
  })
  @ApiResponse({ status: 200, description: 'Cart successfully cleared.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.OK)
  async clearUserCart(@Request() req) {
    const userId = req.user.userId;
    return this.cartService.clearCart(userId);
  }
}
