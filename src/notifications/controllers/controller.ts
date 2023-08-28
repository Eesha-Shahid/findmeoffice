import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException, Put, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { NotificationService } from '../services/service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../schema';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { RolesAuthGuard } from '../../auth/roles-auth.guard';
import { UserType } from '../../common/enums/user.enum';
import { Roles } from '../../auth/roles.decorator';

@Controller('notifications')
@UseGuards(RolesAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @Post()
  // async createNotification(@Body(new ValidationPipe()) createNotificationDto: CreateNotificationDto): Promise<Notification> {
  //   return this.notificationService.create(createNotificationDto);
  // }

  //Returns all notifications for a user
  @Get()
  @Roles(UserType.Owner, UserType.Renter)
  async getAllNotifications(@Req() req): Promise<Notification[]> {
    return this.notificationService.findAll(req.user);
  }

  //Returns specific notification for a user
  @Get(':id')
  @Roles(UserType.Owner, UserType.Renter)
  async getNotificationById(@Param('id') id: string, @Req() req): Promise<Notification> {

    const user = req.user;
    const notification = await this.notificationService.findById(id)

    if (notification.user !== user.id) {
      throw new UnauthorizedException('You are not authorized to view this notification.');
    }

    return this.notificationService.findById(id);
  }

  //Deletes specific notification for a user
  @Delete(':id')
  @Roles(UserType.Owner, UserType.Renter)
  async deleteNotification(@Param('id') id: string, @Req() req): Promise<Notification> {

    const user = req.user;
    const notification = await this.notificationService.findById(id)

    if (notification.user !== user.id) {
      throw new UnauthorizedException('You are not authorized to delete this notification.');
    }
    
    return this.notificationService.deleteById(id);
  }

  // @Put(':id')
  // async updateNotification(
  //   @Param('id') id: string,
  //   @Body(new ValidationPipe()) updateUserDto: UpdateNotificationDto
  // ): Promise<Notification> {
  //   return this.notificationService.updateById(id, updateUserDto);
  // }
}
