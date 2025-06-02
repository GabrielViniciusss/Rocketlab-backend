import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class FindProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter products by title (partial match, case-insensitive)',
    example: 'laptop',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter products by category (exact match, case-insensitive)',
    example: "men's clothing",
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter products with price less than this value',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice must be a number' })
  @IsPositive({ message: 'maxPrice must be a positive number' })
  maxPrice?: number;
}
