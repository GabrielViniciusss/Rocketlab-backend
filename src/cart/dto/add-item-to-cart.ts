import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class AddItemToCartDto {
  @ApiProperty({
    description: 'The ID of the product to add to the cart',
    example: 1,
  })
  @IsInt({ message: 'Product ID must be an integer' })
  @IsPositive({ message: 'Product ID must be a positive number' })
  @IsNotEmpty({ message: 'Product ID should not be empty' })
  productId: number;

  @ApiProperty({
    description: 'The quantity of the product to add',
    example: 2,
    minimum: 1,
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsNotEmpty({ message: 'Quantity should not be empty' })
  quantity: number;
}
