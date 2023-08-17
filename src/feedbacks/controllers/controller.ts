import { Controller, Post, Put, Delete, Body, ValidationPipe, Get, Param, NotFoundException } from '@nestjs/common';
import { FeedbackService } from '../services/service';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback } from '../schema';
import { UpdateFeedbackDto } from '../dto/update-feedback.dto';

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
    return this.feedbackService.findById(id);
  }

  @Put(':id')
  async updateFeedback(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateFeedbackDto
  ): Promise<Feedback> {
    return this.feedbackService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async deleteFeedback(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.deleteById(id);
  }
}
