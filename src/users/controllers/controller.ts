import { Controller, Post, Body, ValidationPipe, Get, Put, Delete, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/service';
import { User } from '../schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserType } from '../../common/enums/user.enum';
import { Roles } from '../../auth/roles.decorator';
import { RolesAuthGuard } from '../../auth/roles-auth.guard';

@Controller('users')
@UseGuards(RolesAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //User can view his own profile
  @Get()
  @Roles(UserType.Owner, UserType.Renter)
  async getUserById(
    @Req() req
  ): Promise<User> {

    return this.userService.findById(req.user.id);
  }

  //User can udpdate his own profile
  @Put()
  @Roles(UserType.Owner, UserType.Renter)
  async updateUser( 
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto, 
    @Req() req
  ): Promise<User> {
    
    return this.userService.updateById(req.user.id, updateUserDto);
  }

  //User can delete his own profile
  @Delete()
  @Roles(UserType.Owner, UserType.Renter)
  async deleteUser(
    @Req() req
  ): Promise<User> {

    return this.userService.deleteById(req.user.id);
  }
}
