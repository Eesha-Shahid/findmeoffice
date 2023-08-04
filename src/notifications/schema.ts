import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NotificationStatus, NotificationType } from '../common/enums/notification.enum';
import { SchemaTypes } from "mongoose";
import { User } from "src/users/schema";

@Schema()
export class Notification {
    @Prop({ required: true })
    content: string;

    @Prop({ required: true, enum: Object.values(NotificationStatus) })
    status: NotificationStatus;

    @Prop({ required: true, enum: Object.values(NotificationType) })
    type: NotificationType;

    @Prop({ type: Date, default: Date.now })
    timestamp: Date;

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
    user: User;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);