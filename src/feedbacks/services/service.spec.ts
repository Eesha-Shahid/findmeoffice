import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { Feedback } from '../schema';
import { FeedbackService } from './service';
import { createFeedbackDto, createdFeedback, mockFeedback, updateFeedbackDto, updatedFeedback } from "../../utlils/feedback.mock";
  
describe('FeedbackService', () => {

    let feedbackService: FeedbackService
    let mockFeedbackModel: Model<Feedback>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FeedbackService,
                {
                    provide: getModelToken(Feedback.name),
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

        feedbackService = module.get<FeedbackService>(FeedbackService);
        mockFeedbackModel = module.get<Model<Feedback>>(getModelToken(Feedback.name));
    })

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('create', () => {

        // Successful feedback creation
        it('should create an feedback with the provided owner', async () => {
        
            mockFeedbackModel.create = jest.fn().mockResolvedValue(createdFeedback);        
            const result = await feedbackService.create(createFeedbackDto);
            expect(mockFeedbackModel.create).toHaveBeenCalledWith(createFeedbackDto);        
            expect(result).toEqual(createdFeedback);
        });
    });
    

    describe('findAll', () => {

        it('should return an array of feedbacks', async () => {

        mockFeedbackModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockFeedback]),
        });

        const result = await feedbackService.findAll();
        expect(mockFeedbackModel.find).toHaveBeenCalled();
        expect(result).toEqual([mockFeedback]);
      });
    });

    describe('findById', () => {

        // Feedback found
        it('should return a feedback by ID', async() => {

            mockFeedbackModel.findById = jest.fn().mockResolvedValue(mockFeedback)
            const result = await feedbackService.findById(mockFeedback._id);
            expect(mockFeedbackModel.findById).toHaveBeenCalledWith(mockFeedback._id);
            expect(result).toEqual(mockFeedback)
        })

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(feedbackService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
      
        // Feedback not found
        it('should throw NotFoundException if feedback is not found', async () => {

            mockFeedbackModel.findById = jest.fn().mockResolvedValue(null);
            await expect(feedbackService.findById(mockFeedback._id)).rejects.toThrow(NotFoundException,);
            expect(mockFeedbackModel.findById).toHaveBeenCalledWith(mockFeedback._id);
        });
    })

    describe('deleteById', () => {

        // Feedback found
        it('should delete and return a feedback', async () => {

            mockFeedbackModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockFeedback);
            const result = await feedbackService.deleteById(mockFeedback._id);
            expect(mockFeedbackModel.findByIdAndDelete).toHaveBeenCalledWith(mockFeedback._id);
            expect(result).toEqual(mockFeedback);
        });

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(feedbackService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
    
        // Feedback not found
        it('should throw NotFoundException if feedback does not exist', async () => {

            mockFeedbackModel.findByIdAndDelete = jest.fn().mockResolvedValue(null); 
            await expect(feedbackService.deleteById(mockFeedback._id)).rejects.toThrow(NotFoundException);
            expect(mockFeedbackModel.findByIdAndDelete).toHaveBeenCalledWith(mockFeedback._id);
        });
    });

    describe('updateById', () => {

        // Feedback found
        it('should update and return a feedback', async () => {
        
            mockFeedbackModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedFeedback),
            });
            
            const result = await feedbackService.updateById(mockFeedback._id, updateFeedbackDto);
            expect(mockFeedbackModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockFeedback._id,
                updateFeedbackDto,
                { new: true }
            );
            expect(result).toEqual(updatedFeedback);
        });
      
        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(feedbackService.updateById(invalidId, updateFeedbackDto)).rejects.toThrow(BadRequestException);
        });
      
        // Feedback not found
        it('should throw NotFoundException if feedback does not exist', async () => {

            mockFeedbackModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
        
            await expect(feedbackService.updateById(mockFeedback._id, updateFeedbackDto)).rejects.toThrow(
              NotFoundException
            );
        });  
    });
} )