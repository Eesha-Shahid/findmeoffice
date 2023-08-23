import { Controller, Post, Body, ValidationPipe, Get, Put, Delete, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/service';
import { User } from '../schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserType } from '../../common/enums/user.enum';
import { Roles } from '../../auth/roles.decorator';
import { RolesAuthGuard } from '../../auth/roles-auth.guard';

@Controller('users')
@UseGuards(RolesAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Creates a new user
  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  //User can view his own profile
  @Get(':id')
  @Roles(UserType.Owner, UserType.Renter)
  async getUserById(@Param('id') id: string, @Req() req): Promise<User> {
    
    const user = req.user; 

    if (user.id !== id) {
      throw new UnauthorizedException('You are not authorized to view this user.');
    }

    return this.userService.findById(id);
  }

  //User can udpdate his own profile
  @Put(':id')
  @Roles(UserType.Owner, UserType.Renter)
  async updateUser( 
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto, @Req() req
  ): Promise<User> {

    const user = req.user; 

    if (user.id !== id) {
      throw new UnauthorizedException('You are not authorized to update this user.');
    }
    
    return this.userService.updateById(id, updateUserDto);
  }

  //User can delete his own profile
  @Delete(':id')
  @Roles(UserType.Owner, UserType.Renter)
  async deleteUser(@Param('id') id: string, @Req() req): Promise<User> {
    const user = req.user; 

    if (user.id !== id) {
      throw new UnauthorizedException('You are not authorized to delete this user.');
    }

    return this.userService.deleteById(id);
  }

  // @Get()
  // async getAllUsers(): Promise<User[]> {
  //   return this.userService.findAll();
  // }
}
