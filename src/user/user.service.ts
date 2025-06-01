/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID "${id}" not found, cannot update.`,
      );
    }

    const dataToUpdate: Prisma.UserUpdateInput = {};

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailTaken = await this.findOneByEmail(updateUserDto.email);
      if (emailTaken && emailTaken.id !== id) {
        throw new ConflictException(
          `Email "${updateUserDto.email}" is already in use by another account.`,
        );
      }
      dataToUpdate.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    if (updateUserDto.name) {
      dataToUpdate.name = updateUserDto.name;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID "${id}" not found, cannot remove.`,
      );
    }
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return { message: `User with ID ${id} was successfully deleted.` };
  }
}
