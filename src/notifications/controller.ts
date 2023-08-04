import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException } from '@nestjs/common';
import { NotificationService } from './service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from './schema';

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
    const notification = await this.notificationService.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }
}
