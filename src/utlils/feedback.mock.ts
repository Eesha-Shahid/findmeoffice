import { mockUser } from "./user.mock";

export const mockFeedback = {
    _id:  '64c7a679089d68e116069f40',
    user: mockUser,
    subject: 'Sample Subject',
    message: 'Sample Message'
};

export const createFeedbackDto = {
    user: mockUser,
    subject: 'Sample Subject',
    message: 'Sample Message'
};

export const createdFeedback = {
    _id: '64c7a679089d68e116069f40',
    ...createFeedbackDto,
};


export const updateFeedbackDto = {
    subject: 'Updated Subject',
};

export const updatedFeedback = {
    ...mockFeedback,
    subject: 'Updated Subject',
};