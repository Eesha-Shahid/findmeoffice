import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationController } from './controller';
import { NotificationService } from './service';
import { Notification, NotificationSchema } from './schema';

@Module({
    imports: [ MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]) ],
    controllers: [NotificationController],
    providers: [NotificationService],
})

export class NotificationModule {}