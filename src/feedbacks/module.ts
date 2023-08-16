import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FeedbackController } from './controllers/controller';
import { FeedbackService } from './services/service';
import { Feedback, FeedbackSchema } from './schema';

@Module({
    imports: [ MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]) ],
    controllers: [FeedbackController],
    providers: [FeedbackService],
})

export class FeedbackModule {}