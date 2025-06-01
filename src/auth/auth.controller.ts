/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth') // junta os endpoints de autenticação no Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint para login de usuário.
   * Utiliza o AuthGuard('local') que, por sua vez, aciona a LocalStrategy.
   * A LocalStrategy usa o AuthService.validateUser().
   * Se bem-sucedido, req.user é populado e então AuthService.login() é chamado.
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user and return a JWT token' })
  @ApiBody({ type: LoginDto, description: 'User credentials for login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, JWT token returned.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., missing fields, DTO validation failed).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (invalid credentials).',
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth('jwt-token')
  @ApiOperation({ summary: 'Get profile of currently authenticated user' })
  @ApiResponse({ status: 200, description: 'Return user profile.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (token invalid or not provided).',
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
