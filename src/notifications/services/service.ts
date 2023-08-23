import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '../schema';
import  { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) 
    private notificationModel: Model<Notification>
    ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationModel.create(createNotificationDto);
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ user: userId }).exec();
  }

  async findById(id: string): Promise<Notification> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid notification ID');
    }

    const notification = await this.notificationModel.findById(id);

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    return notification;
  }
  
  async updateById(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification | null> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid notification ID');
    }

    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
    
    if (!updatedNotification) {
        throw new NotFoundException('Notification not found');
    }

    return updatedNotification;
  }

  async deleteById(id: string): Promise<Notification> {
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestException('Invalid notification ID');
    }
    
    const deletedNotification = await this.notificationModel.findByIdAndDelete(id);
    
    if (!deletedNotification) {
        throw new NotFoundException('Notification not found');
    }

    return deletedNotification;
  }
}