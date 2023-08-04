import { Controller, Post, Body, ValidationPipe, Get, Param, NotFoundException } from '@nestjs/common';
import { FeedbackService } from './service';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback } from './schema';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async createFeedback(@Body(new ValidationPipe()) createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  async getAllFeedbacks(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  async getFeedbackById(@Param('id') id: string): Promise<Feedback> {
    const feedback = await this.feedbackService.findById(id);
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }
}
