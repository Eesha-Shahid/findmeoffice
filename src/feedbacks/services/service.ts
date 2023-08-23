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

    async create(
        createFeedbackDto: CreateFeedbackDto,
        user: User
        ): Promise<Feedback> {
        const data = Object.assign(createFeedbackDto, { user: user._id })
        return this.feedbackModel.create(data);
    }

    async findAll(): Promise<Feedback[]> {
        return this.feedbackModel.find().exec();
    }

    async findById(id: string): Promise<Feedback> {
        if (!mongoose.isValidObjectId(id)) {
          throw new BadRequestException('Invalid feedback ID');
        }
    
        const feedback = await this.feedbackModel.findById(id);
    
        if (!feedback) {
          throw new NotFoundException('Feedback not found.');
        }
    
        return feedback;
    }
    
    async updateById(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback | null> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('Invalid feedback ID');
        }

        const updatedFeedback = await this.feedbackModel
            .findByIdAndUpdate(id, updateFeedbackDto, { new: true })
            .exec();
        
        if (!updatedFeedback) {
            throw new NotFoundException('Feedback not found');
        }

        return updatedFeedback;
    }

    async deleteById(id: string): Promise<Feedback> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('Invalid feedback ID');
        }
        
        const deletedFeedback = await this.feedbackModel.findByIdAndDelete(id);
        
        if (!deletedFeedback) {
            throw new NotFoundException('Feedback not found');
        }

        return deletedFeedback;
    }
}