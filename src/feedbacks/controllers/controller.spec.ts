import { Test, TestingModule } from "@nestjs/testing";
import { FeedbackService } from "../services/service";
import { FeedbackController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";

enum UserType {
    Renter = 'renter',
    Owner = 'owner',
}
  
describe('FeedbackController', () => {

    let feedbackService: FeedbackService
    let feedbackController: FeedbackController

    const mockUser = {
        _id:  '64c7a679089d68e116069f40',
        name: 'John Doe',
        email: 'johnn.doe@example.com',
        phoneNumber: '03355989889',
        profilePic: null,
        userType: UserType.Renter
    }

    const mockFeedback = {
        _id:  '64c7a679089d68e116069f40',
        user: mockUser,
        subject: 'Sample Subject',
        message: 'Sample Message'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FeedbackController],
            providers: [
                {
                    provide: FeedbackService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn().mockReturnValue([mockFeedback]),
                        findById: jest.fn().mockReturnValue(mockFeedback),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn()
                    }
                }
            ],
        }).compile()

        feedbackService = module.get<FeedbackService>(FeedbackService);
        feedbackController = module.get<FeedbackController>(FeedbackController);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear any calls and reset mock behaviors
    });

    it('should be defined', () => {
        expect(feedbackController).toBeDefined();
    })

    describe('createFeedback', () => {
        it('should create a feedback', async() => {

            const createFeedbackDto = {
                user: mockUser,
                subject: 'Sample Subject',
                message: 'Sample Message'
            };
        
            const createdFeedback = {
                _id: '64c7a679089d68e116069f40',
                ...createFeedbackDto,
            };
        
            // Mock the create method to return the created feedback
            feedbackService.create = jest.fn().mockResolvedValue(createdFeedback);          

            // Call the createFeedback method and perform assertions
            const result = await feedbackController.createFeedback(createFeedbackDto);
            expect(feedbackService.create).toHaveBeenCalledWith(createFeedbackDto);        
            expect(result).toEqual(createdFeedback);
        })
    })

    describe('getAllFeedbacks', () => {
        it('should return an array of feedbacks', async() => {
            const result = await feedbackController.getAllFeedbacks();
            expect(feedbackService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockFeedback]);
        })
    })

    describe('getFeedbackById', () => {

        //Feedback found
        it('should return an array of feedbacks', async() => {
            const result = await feedbackController.getFeedbackById(mockFeedback._id);
            expect(feedbackService.findById).toHaveBeenCalledWith(mockFeedback._id);
            expect(result).toEqual(mockFeedback);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            feedbackService.findById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(feedbackController.getFeedbackById(invalidId)).rejects.toThrow(BadRequestException);
            expect(feedbackService.findById).toHaveBeenCalledWith(invalidId);
        });
      
        // Feedback not found
        it('should throw NotFoundException if feedback is not found', async () => {

            feedbackService.findById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(feedbackController.getFeedbackById(mockFeedback._id)).rejects.toThrow(NotFoundException);
            expect(feedbackService.findById).toHaveBeenCalledWith(mockFeedback._id);
        });
    })

    describe('updateFeedback', () => {

        const updateFeedbackDto = {
            subject: 'Updated Subject',
        };
    
        const updatedFeedback = {
            ...mockFeedback,
            subject: 'Updated Subject',
        };

        it('should update and return a feedback', async() => {
            
            feedbackService.updateById = jest.fn().mockResolvedValue(updatedFeedback);          
            const result = await feedbackController.updateFeedback(mockFeedback._id, updateFeedbackDto);
            expect(feedbackService.updateById).toHaveBeenCalledWith(
                mockFeedback._id,
                updateFeedbackDto,
            );        
            expect(result).toEqual(updatedFeedback);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            feedbackService.updateById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(feedbackController.updateFeedback(invalidId, updateFeedbackDto)).rejects.toThrow(BadRequestException);
            expect(feedbackService.updateById).toHaveBeenCalledWith(
                invalidId,
                updateFeedbackDto
            );
        });
      
        // Feedback not found
        it('should throw NotFoundException if feedback is not found', async () => {

            feedbackService.updateById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(feedbackController.updateFeedback(mockFeedback._id, updateFeedbackDto)).rejects.toThrow(NotFoundException);
            expect(feedbackService.updateById).toHaveBeenCalledWith(
                mockFeedback._id,
                updateFeedbackDto
            );
        });
    })

    describe('deleteFeedback', () => {

        // Feedback found
        it('should delete and return a feedback', async() => {

            feedbackService.deleteById = jest.fn().mockResolvedValue(mockFeedback);          
            const result = await feedbackController.deleteFeedback(mockFeedback._id);
            expect(feedbackService.deleteById).toHaveBeenCalledWith(mockFeedback._id);        
            expect(result).toEqual(mockFeedback);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            feedbackService.deleteById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(feedbackController.deleteFeedback(invalidId)).rejects.toThrow(BadRequestException);
            expect(feedbackService.deleteById).toHaveBeenCalledWith(invalidId);
        });
      
        // Feedback not found
        it('should throw NotFoundException if feedback is not found', async () => {

            feedbackService.deleteById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(feedbackController.deleteFeedback(mockFeedback._id)).rejects.toThrow(NotFoundException);
            expect(feedbackService.deleteById).toHaveBeenCalledWith(mockFeedback._id);
        });
    })
})