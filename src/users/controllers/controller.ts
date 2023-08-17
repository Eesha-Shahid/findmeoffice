import { Controller, Post, Body, ValidationPipe, Get, Put, Delete, Param, NotFoundException } from '@nestjs/common';
import { UserService } from '../services/service';
import { User } from '../schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteById(id);
  }
}
