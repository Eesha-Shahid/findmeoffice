import { IsNotEmpty, IsEnum, IsDateString, IsMongoId, IsOptional, isDate, isDateString } from 'class-validator';
import { NotificationStatus, NotificationType } from '../common/enums/notification.enum';

export class CreateNotificationDto {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsEnum(NotificationStatus)
    status: NotificationStatus;

    @IsNotEmpty()
    @IsEnum(NotificationType)
    type: NotificationType;

    @IsNotEmpty()
    @IsMongoId()
    user: string; 
}
