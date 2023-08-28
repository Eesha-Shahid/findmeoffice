import { NotificationStatus, NotificationType } from "../common/enums/notification.enum";
import { mockUser } from "./user.mock";

export const mockNotification = {
    _id:  '64c7a679089d68e116069f40',
    content: 'Sample Notification',
    status: NotificationStatus.Delivered,
    type: NotificationType.paymentReceived,
    user: mockUser
};

export const createNotificationDto = {
    content: 'Sample Notification',
    status: NotificationStatus.Delivered,
    type: NotificationType.paymentReceived,
    user: mockUser
};

export const createdNotification = {
    _id: '64c7a679089d68e116069f40',
    ...createNotificationDto,
};

export const updateNotificationDto = {
    content: 'Updated Notification',
    status: NotificationStatus.Read,
};

export const updatedNotification = {
    ...mockNotification,
    bcontent: 'Updated Notification',
    status: NotificationStatus.Read
};