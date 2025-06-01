import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'The updated title of the product',
    example: 'Improved Laptop Pro X+',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title should not be empty if provided' })
  title?: string;

  @ApiPropertyOptional({
    description: 'The updated price of the product',
    example: 1099.99,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    description: 'An updated detailed description of the product',
    example: 'This improved laptop now includes more RAM and a faster SSD.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Description should not be empty if provided' })
  description?: string;

  @ApiPropertyOptional({
    description: 'The updated category the product belongs to',
    example: 'premium electronics',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Category should not be empty if provided' })
  category?: string;

  @ApiPropertyOptional({
    description: 'URL of the updated product image',
    example: 'https://example.com/new_image.jpg',
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}
