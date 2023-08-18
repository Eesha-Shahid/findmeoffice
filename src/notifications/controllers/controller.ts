import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException, Put, Delete } from '@nestjs/common';
import { NotificationService } from '../services/service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../schema';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body(new ValidationPipe()) createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.findById(id);
  }

  @Put(':id')
  async updateNotification(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateNotificationDto
  ): Promise<Notification> {
    return this.notificationService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.deleteById(id);
  }
}
