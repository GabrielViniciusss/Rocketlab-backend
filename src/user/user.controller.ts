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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users') // Junta os endpoints de usuário no Swagger
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (Register)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., validation error on DTO).',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict (e.g., email already in use).',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Return the user.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to update',
    type: Number,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., validation error on DTO).',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict (e.g., email already in use by another user).',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted.',
    content: {
      'application/json': {
        schema: {
          example: { message: 'User with ID 1 was successfully deleted.' },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @HttpCode(HttpStatus.OK) // Nosso serviço retorna um objeto de mensagem com status 200
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
