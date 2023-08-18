import { mockUser } from "./user.mock";

export const mockCredentials = {
    _id:  '64c7a679089d68e216069f40',
    user: mockUser,
    cardNumber: '379354508162306',
    cardholderName: 'John Doe',
    expiryDate: '2020-02-31',
    securityCode: '333',
}

export const createCredentialsDto = {
    user: mockUser,
    cardNumber: '379354508162306',
    cardholderName: 'John Doe',
    expiryDate: '2020-02-31',
    securityCode: '333',
};

export const createdCredentials = {
    _id: '64c7a679089d68e116069f40',
    ...createCredentialsDto,
};

export const updateCredentialsDto = {
    cardNumber: '379354508122306',
    cardholderName: 'Sarah Hanks',
};

export const updatedCredentials = {
    ...mockCredentials,
    cardNumber: '379354508122306',
    cardholderName: 'Sarah Hanks'
};