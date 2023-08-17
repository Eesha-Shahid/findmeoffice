import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationController } from './controllers/controller';
import { NotificationService } from './services/service';
import { Notification, NotificationSchema } from './schema';

@Module({
    imports: [ MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]) ],
    controllers: [NotificationController],
    providers: [NotificationService],
})

export class NotificationModule {}