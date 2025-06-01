import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [ProductsModule],
  controllers: [CartController],
  providers: [CartService, PrismaService, ProductsService],
})
export class CartModule {}
