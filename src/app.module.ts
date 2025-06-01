import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductsModule, UserModule, CartModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
