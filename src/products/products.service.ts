import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { FindProductsQueryDto } from './dto/find-products-query';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(query?: FindProductsQueryDto) {
    const where: Prisma.ProductWhereInput = {};

    if (query?.title) {
      where.title = {
        contains: query.title,
      };
    }

    if (query?.category) {
      where.category = {
        equals: query.category,
      };
    }

    if (query?.maxPrice) {
      where.price = {
        lt: query.maxPrice,
      };
    }

    return this.prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productExists = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundException(
        `Product with ID "${id}" not found, cannot update.`,
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID "${id}" not found, cannot remove.`,
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: `Product with ID ${id} was successfully deleted.` };
  }
}
