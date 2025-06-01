import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @ApiProperty({
    description: 'The new quantity for the cart item',
    example: 3,
    minimum: 1,
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsNotEmpty({ message: 'Quantity should not be empty' })
  quantity: number;
}
