import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { Notification } from '../schema';
import { NotificationService } from './service';
import { createNotificationDto, createdNotification, mockNotification, updateNotificationDto, updatedNotification } from '../../utlils/notification.mock';
  
describe('NotificationService', () => {

    let notificationService: NotificationService
    let mockNotificationModel: Model<Notification>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: getModelToken(Notification.name),
                    useValue: {
                        create: jest.fn(),
                        find: jest.fn(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn()
                    }
                },
            ],
        }).compile()

        notificationService = module.get<NotificationService>(NotificationService);
        mockNotificationModel = module.get<Model<Notification>>(getModelToken(Notification.name));
    })

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('create', () => {

        // Successful notification creation
        it('should create an notification with the provided owner', async () => {
        
            mockNotificationModel.create = jest.fn().mockResolvedValue(createdNotification);        
            const result = await notificationService.create(createNotificationDto);
            expect(mockNotificationModel.create).toHaveBeenCalledWith(createNotificationDto);        
            expect(result).toEqual(createdNotification);
        });
    });
    

    describe('findAll', () => {

        it('should return an array of notifications', async () => {

        mockNotificationModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockNotification]),
        });

        const result = await notificationService.findAll();
        expect(mockNotificationModel.find).toHaveBeenCalled();
        expect(result).toEqual([mockNotification]);
      });
    });

    describe('findById', () => {

        // Notification found
        it('should return a notification by ID', async() => {

            mockNotificationModel.findById = jest.fn().mockResolvedValue(mockNotification)
            const result = await notificationService.findById(mockNotification._id);
            expect(mockNotificationModel.findById).toHaveBeenCalledWith(mockNotification._id);
            expect(result).toEqual(mockNotification)
        })

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(notificationService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
      
        // Notification not found
        it('should throw NotFoundException if notification is not found', async () => {

            mockNotificationModel.findById = jest.fn().mockResolvedValue(null);
            await expect(notificationService.findById(mockNotification._id)).rejects.toThrow(NotFoundException,);
            expect(mockNotificationModel.findById).toHaveBeenCalledWith(mockNotification._id);
        });
    })

    describe('deleteById', () => {

        // Notification found
        it('should delete and return a notification', async () => {

            mockNotificationModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockNotification);
            const result = await notificationService.deleteById(mockNotification._id);
            expect(mockNotificationModel.findByIdAndDelete).toHaveBeenCalledWith(mockNotification._id);
            expect(result).toEqual(mockNotification);
        });

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(notificationService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
    
        // Notification not found
        it('should throw NotFoundException if notification does not exist', async () => {

            mockNotificationModel.findByIdAndDelete = jest.fn().mockResolvedValue(null); 
            await expect(notificationService.deleteById(mockNotification._id)).rejects.toThrow(NotFoundException);
            expect(mockNotificationModel.findByIdAndDelete).toHaveBeenCalledWith(mockNotification._id);
        });
    });

    describe('updateById', () => {

        // Notification found
        it('should update and return a notification', async () => {
        
            mockNotificationModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedNotification),
            });
            
            const result = await notificationService.updateById(mockNotification._id, updateNotificationDto);
            expect(mockNotificationModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockNotification._id,
                updateNotificationDto,
                { new: true }
            );
            expect(result).toEqual(updatedNotification);
        });
      
        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(notificationService.updateById(invalidId, updateNotificationDto)).rejects.toThrow(BadRequestException);
        });
      
        // Notification not found
        it('should throw NotFoundException if notification does not exist', async () => {
        
            mockNotificationModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
        
            await expect(notificationService.updateById(mockNotification._id, updateNotificationDto)).rejects.toThrow(
              NotFoundException
            );
        });  
    });
} )