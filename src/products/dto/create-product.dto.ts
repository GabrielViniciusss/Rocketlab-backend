import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The title of the product',
    example: 'Amazing Laptop Pro X',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 999.99,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'A detailed description of the product',
    example: 'This laptop has all the new features and a great screen.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The category the product belongs to',
    example: 'electronics',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  image: string;
}
