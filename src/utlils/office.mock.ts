import { Schema } from "mongoose";
import { mockUser } from "./user.mock";
import { OfficeType, RentalStatus } from '../common/enums/office.enum';

export const mockOffice = {
    _id:  '64c7a679089d68e116069f40',
    buildingName: 'Example Building',
    buildingSize: new Schema.Types.Decimal128('1500'), //Converts to a valid Decimal128 from string
    monthlyRate: new Schema.Types.Decimal128('2500.12'),
    image: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
    ],
    address: '123 Main Street',
    latitude: new Schema.Types.Decimal128('37.7749'),
    longitude: new Schema.Types.Decimal128('-122.4194'),
    rentalStatus: RentalStatus.Rented,
    officeType: [OfficeType.Buyer,OfficeType.CoworkingDesk],
    owner: mockUser
};

export const createOfficeDto = {
    buildingName: 'Example Building',
    buildingSize: new Schema.Types.Decimal128('1500'), 
    monthlyRate: new Schema.Types.Decimal128('2500.12'),
    image: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
    ],
    address: '123 Main Street',
    latitude: new Schema.Types.Decimal128('37.7749'),
    longitude: new Schema.Types.Decimal128('-122.4194'),
    rentalStatus: RentalStatus.Rented,
    officeType: [OfficeType.Buyer,OfficeType.CoworkingDesk],
    owner: mockUser
};

export const createdOffice = {
    _id: '64c7a679089d68e116069f40',
    ...createOfficeDto,
};

export const updateOfficeDto = {
    buildingName: 'Updated Building',
    address: '123 Wolf Street',
};

export const updatedOffice = {
    ...mockUser,
    buildingName: 'Updated Building',
    address: '123 Wolf Street',

};