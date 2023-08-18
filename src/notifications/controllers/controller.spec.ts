import { Test, TestingModule } from "@nestjs/testing";
import { NotificationService } from "../services/service";
import { NotificationController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { createNotificationDto, createdNotification, mockNotification, updateNotificationDto, updatedNotification } from "../../utlils/notification.mock";

describe('NotificationController', () => {

    let notificationService: NotificationService
    let notificationController: NotificationController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationController],
            providers: [
                {
                    provide: NotificationService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn().mockReturnValue([mockNotification]),
                        findById: jest.fn().mockReturnValue(mockNotification),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn()
                    }
                }
            ],
        }).compile()

        notificationService = module.get<NotificationService>(NotificationService);
        notificationController = module.get<NotificationController>(NotificationController);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear any calls and reset mock behaviors
    });

    it('should be defined', () => {
        expect(notificationController).toBeDefined();
    })

    describe('createNotification', () => {
        it('should create a notification', async() => {
        
            // Mock the create method to return the created notification
            notificationService.create = jest.fn().mockResolvedValue(createdNotification);          

            // Call the createNotification method and perform assertions
            const result = await notificationController.createNotification(createNotificationDto);
            expect(notificationService.create).toHaveBeenCalledWith(createNotificationDto);        
            expect(result).toEqual(createdNotification);
        })
    })

    describe('getAllNotifications', () => {
        it('should return an array of notifications', async() => {
            const result = await notificationController.getAllNotifications();
            expect(notificationService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockNotification]);
        })
    })

    describe('getNotificationById', () => {

        //Notification found
        it('should return an array of notifications', async() => {
            const result = await notificationController.getNotificationById(mockNotification._id);
            expect(notificationService.findById).toHaveBeenCalledWith(mockNotification._id);
            expect(result).toEqual(mockNotification);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            notificationService.findById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(notificationController.getNotificationById(invalidId)).rejects.toThrow(BadRequestException);
            expect(notificationService.findById).toHaveBeenCalledWith(invalidId);
        });
      
        // Notification not found
        it('should throw NotFoundException if notification is not found', async () => {

            notificationService.findById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(notificationController.getNotificationById(mockNotification._id)).rejects.toThrow(NotFoundException);
            expect(notificationService.findById).toHaveBeenCalledWith(mockNotification._id);
        });
    })

    describe('updateNotification', () => {

        it('should update and return a notification', async() => {
            
            notificationService.updateById = jest.fn().mockResolvedValue(updatedNotification);          
            const result = await notificationController.updateNotification(mockNotification._id, updateNotificationDto);
            expect(notificationService.updateById).toHaveBeenCalledWith(
                mockNotification._id,
                updateNotificationDto,
            );        
            expect(result).toEqual(updatedNotification);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            notificationService.updateById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(notificationController.updateNotification(invalidId, updateNotificationDto)).rejects.toThrow(BadRequestException);
            expect(notificationService.updateById).toHaveBeenCalledWith(
                invalidId,
                updateNotificationDto
            );
        });
      
        // Notification not found
        it('should throw NotFoundException if notification is not found', async () => {

            notificationService.updateById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(notificationController.updateNotification(mockNotification._id, updateNotificationDto)).rejects.toThrow(NotFoundException);
            expect(notificationService.updateById).toHaveBeenCalledWith(
                mockNotification._id,
                updateNotificationDto
            );
        });
    })

    describe('deleteNotification', () => {

        // Notification found
        it('should delete and return a notification', async() => {

            notificationService.deleteById = jest.fn().mockResolvedValue(mockNotification);          
            const result = await notificationController.deleteNotification(mockNotification._id);
            expect(notificationService.deleteById).toHaveBeenCalledWith(mockNotification._id);        
            expect(result).toEqual(mockNotification);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            notificationService.deleteById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(notificationController.deleteNotification(invalidId)).rejects.toThrow(BadRequestException);
            expect(notificationService.deleteById).toHaveBeenCalledWith(invalidId);
        });
      
        // Notification not found
        it('should throw NotFoundException if notification is not found', async () => {

            notificationService.deleteById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(notificationController.deleteNotification(mockNotification._id)).rejects.toThrow(NotFoundException);
            expect(notificationService.deleteById).toHaveBeenCalledWith(mockNotification._id);
        });
    })
})