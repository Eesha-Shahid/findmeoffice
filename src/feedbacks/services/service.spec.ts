import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { Feedback } from '../schema';
import { FeedbackService } from './service';
import { createFeedbackDto, createdFeedback, mockFeedback, updateFeedbackDto, updatedFeedback } from "../../utlils/feedback.mock";
import { mockUser } from '../../utlils/user.mock';
  
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
            const result = await feedbackService.create(createFeedbackDto, mockUser._id);
            expect(mockFeedbackModel.create).toHaveBeenCalledWith(createFeedbackDto);        
            expect(result).toEqual(createdFeedback);
        });
    });
} )