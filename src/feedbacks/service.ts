import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from './schema';
import  { CreateFeedbackDto } from '../dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback.name) 
        private feedbackModel: Model<Feedback>
        ) {}

    async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
        const createdFeedback = new this.feedbackModel(createFeedbackDto);
        return createdFeedback.save();
    }

    async findAll(): Promise<Feedback[]> {
        return this.feedbackModel.find().exec();
    }

    async findById(id: string): Promise<Feedback | null> {
        return this.feedbackModel.findById(id).exec();
    }
}