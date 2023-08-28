import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from '../schema';
import  { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { UpdateFeedbackDto } from 'src/feedbacks/dto/update-feedback.dto';
import { User } from 'src/users/schema';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback.name) 
        private feedbackModel: Model<Feedback>
        ) {}

    //Creates feedback for a user
    async create(
        createFeedbackDto: CreateFeedbackDto,
        userID: string
        ): Promise<Feedback> {
        const data = Object.assign(createFeedbackDto, { user: userID })
        return this.feedbackModel.create(data);
    }
}