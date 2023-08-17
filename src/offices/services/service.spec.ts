import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { Office } from '../schema';
import { OfficeService } from './service';

enum UserType {
    Renter = 'renter',
    Owner = 'owner',
}

enum OfficeType {
    Buyer = 'permanent',
    Owner = 'private day',
    MeetingRoom = 'meeting room',
    CoworkingDesk = 'co working desk',
    EventSpace = 'event space',
}

enum RentalStatus {
    Available = 'available',
    Rented = 'rented'
}
  
describe('OfficeService', () => {

    let officeService: OfficeService
    let mockOfficeModel: Model<Office>;

    const mockUser = {
        _id:  '64c7a679089d68e116069f40',
        name: 'John Doe',
        email: 'johnn.doe@example.com',
        phoneNumber: '03355989889',
        profilePic: null,
        userType: UserType.Renter
    }

    const mockOffice = {
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OfficeService,
                {
                    provide: getModelToken(Office.name),
                    useValue: {
                        create: jest.fn(),
                        find: jest.fn(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn()
                    }
                },
            ],
        }).compile()

        officeService = module.get<OfficeService>(OfficeService);
        mockOfficeModel = module.get<Model<Office>>(getModelToken(Office.name));
    })

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('create', () => {

        // Successful office creation
        it('should create an office with the provided owner', async () => {

            const createOfficeDto = {
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
        
            const createdOffice = {
                _id: '64c7a679089d68e116069f40',
                ...createOfficeDto,
            };
        
            mockOfficeModel.create = jest.fn().mockResolvedValue(createdOffice);        
            const result = await officeService.create(createOfficeDto);
            expect(mockOfficeModel.create).toHaveBeenCalledWith(createOfficeDto);        
            expect(result).toEqual(createdOffice);
        });
    });
    

    describe('findAll', () => {

        it('should return an array of offices', async () => {

        mockOfficeModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockOffice]),
        });

        const result = await officeService.findAll();
        expect(mockOfficeModel.find).toHaveBeenCalled();
        expect(result).toEqual([mockOffice]);
      });
    });

    describe('findById', () => {

        // Office found
        it('should return a office by ID', async() => {

            mockOfficeModel.findById = jest.fn().mockResolvedValue(mockOffice)
            const result = await officeService.findById(mockOffice._id);
            expect(mockOfficeModel.findById).toHaveBeenCalledWith(mockOffice._id);
            expect(result).toEqual(mockOffice)
        })

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(officeService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
      
        // Office not found
        it('should throw NotFoundException if office is not found', async () => {

            mockOfficeModel.findById = jest.fn().mockResolvedValue(null);
            await expect(officeService.findById(mockOffice._id)).rejects.toThrow(NotFoundException,);
            expect(mockOfficeModel.findById).toHaveBeenCalledWith(mockOffice._id);
        });
    })

    describe('deleteById', () => {

        // Office found
        it('should delete and return a office', async () => {

            mockOfficeModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockOffice);
            const result = await officeService.deleteById(mockOffice._id);
            expect(mockOfficeModel.findByIdAndDelete).toHaveBeenCalledWith(mockOffice._id);
            expect(result).toEqual(mockOffice);
        });

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(officeService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
    
        // Office not found
        it('should throw NotFoundException if office does not exist', async () => {

            mockOfficeModel.findByIdAndDelete = jest.fn().mockResolvedValue(null); 
            await expect(officeService.deleteById(mockOffice._id)).rejects.toThrow(NotFoundException);
            expect(mockOfficeModel.findByIdAndDelete).toHaveBeenCalledWith(mockOffice._id);
        });
    });

    describe('updateById', () => {

        // Office found
        it('should update and return a office', async () => {
            const updateOfficeDto = {
                buildingName: 'Updated Building',
                address: '123 Wolf Street',
            };
        
            const updatedOffice = {
                _id: mockOffice._id,
                buildingName: 'Updated Building',
                buildingSize: new Schema.Types.Decimal128('1500'), //Converts to a valid Decimal128 from string
                monthlyRate: new Schema.Types.Decimal128('2500.12'),
                image: [
                    "https://example.com/image1.jpg",
                    "https://example.com/image2.jpg",
                    "https://example.com/image3.jpg"
                ],
                address: '123 Wolf Street',
                latitude: new Schema.Types.Decimal128('37.7749'),
                longitude: new Schema.Types.Decimal128('-122.4194'),
                rentalStatus: RentalStatus.Rented,
                officeType: [OfficeType.Buyer,OfficeType.CoworkingDesk],
                owner: mockUser
            };
        
            mockOfficeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedOffice),
            });
            
            const result = await officeService.updateById(mockOffice._id, updateOfficeDto);
            expect(mockOfficeModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockOffice._id,
                updateOfficeDto,
                { new: true }
            );
            expect(result).toEqual(updatedOffice);
        });
      
        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {
            const invalidId = 'invalid-id';
            const updateOfficeDto = {
                buildingName: 'Updated Building',
                address: '123 Wolf Street',
            };
          
            await expect(officeService.updateById(invalidId, updateOfficeDto)).rejects.toThrow(BadRequestException);
        });
      
        // Office not found
        it('should throw NotFoundException if office does not exist', async () => {
            const updateOfficeDto = {
                buildingName: 'Updated Building',
                address: '123 Wolf Street',
            };
        
            mockOfficeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
        
            await expect(officeService.updateById(mockOffice._id, updateOfficeDto)).rejects.toThrow(
              NotFoundException
            );
        });  
    });
} )