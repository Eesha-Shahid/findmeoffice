import { UserType } from '../common/enums/user.enum'; // Import the UserType enum if it's in a separate file

export const mockUser = {
    _id: '64c7a679089d68e116069f40',
    stripeCustomerId: 'cus_OWZjlVRuzVxoJv',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'john123',
    phoneNumber: '03355989889',
    profilePic: null,
    userType: UserType.Renter
};

export const createUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '03355989889',
    password: 'john123',
    profilePic: null,
    userType: UserType.Renter,
};

export const createdUser = {
    _id: '64c7a679089d68e116069f40',
    stripeCustomerId: 'cus_OWZjlVRuzVxoJv',
    ...createUserDto,
};

export const updatedUser = {
    ...mockUser,
    name: 'Updated Name',
    phoneNumber: '03340111774',
};

export const updateUserDto = {
    name: 'Updated Name',
    phoneNumber: '03340111774',
};
