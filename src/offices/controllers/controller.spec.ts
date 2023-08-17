import { Test, TestingModule } from "@nestjs/testing";
import { OfficeService } from "../services/service";
import { OfficeController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Schema } from "mongoose";

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
  
describe('OfficeController', () => {

    let officeService: OfficeService
    let officeController: OfficeController

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
            controllers: [OfficeController],
            providers: [
                {
                    provide: OfficeService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn().mockReturnValue([mockOffice]),
                        findById: jest.fn().mockReturnValue(mockOffice),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn()
                    }
                }
            ],
        }).compile()

        officeService = module.get<OfficeService>(OfficeService);
        officeController = module.get<OfficeController>(OfficeController);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear any calls and reset mock behaviors
    });

    it('should be defined', () => {
        expect(officeController).toBeDefined();
    })

    describe('createOffice', () => {
        it('should create a office', async() => {

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
        
            // Mock the create method to return the created office
            officeService.create = jest.fn().mockResolvedValue(createdOffice);          

            // Call the createOffice method and perform assertions
            const result = await officeController.createOffice(createOfficeDto);
            expect(officeService.create).toHaveBeenCalledWith(createOfficeDto);        
            expect(result).toEqual(createdOffice);
        })
    })

    describe('getAllOffices', () => {
        it('should return an array of offices', async() => {
            const result = await officeController.getAllOffices();
            expect(officeService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockOffice]);
        })
    })

    describe('getOfficeById', () => {

        //Office found
        it('should return an array of offices', async() => {
            const result = await officeController.getOfficeById(mockOffice._id);
            expect(officeService.findById).toHaveBeenCalledWith(mockOffice._id);
            expect(result).toEqual(mockOffice);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            officeService.findById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(officeController.getOfficeById(invalidId)).rejects.toThrow(BadRequestException);
            expect(officeService.findById).toHaveBeenCalledWith(invalidId);
        });
      
        // Office not found
        it('should throw NotFoundException if office is not found', async () => {

            officeService.findById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(officeController.getOfficeById(mockOffice._id)).rejects.toThrow(NotFoundException);
            expect(officeService.findById).toHaveBeenCalledWith(mockOffice._id);
        });
    })

    describe('updateOffice', () => {

        const updateOfficeDto = {
            buildingName: 'Updated Building',
            address: '123 Wolf Street',
        };
    
        const updatedOffice = {
            ...mockOffice,
            buildingName: 'Updated Building',
            address: '123 Wolf Street'
        };

        it('should update and return a office', async() => {
            
            officeService.updateById = jest.fn().mockResolvedValue(updatedOffice);          
            const result = await officeController.updateOffice(mockOffice._id, updateOfficeDto);
            expect(officeService.updateById).toHaveBeenCalledWith(
                mockOffice._id,
                updateOfficeDto,
            );        
            expect(result).toEqual(updatedOffice);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            officeService.updateById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(officeController.updateOffice(invalidId, updateOfficeDto)).rejects.toThrow(BadRequestException);
            expect(officeService.updateById).toHaveBeenCalledWith(
                invalidId,
                updateOfficeDto
            );
        });
      
        // Office not found
        it('should throw NotFoundException if office is not found', async () => {

            officeService.updateById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(officeController.updateOffice(mockOffice._id, updateOfficeDto)).rejects.toThrow(NotFoundException);
            expect(officeService.updateById).toHaveBeenCalledWith(
                mockOffice._id,
                updateOfficeDto
            );
        });
    })

    describe('deleteOffice', () => {

        // Office found
        it('should delete and return a office', async() => {

            officeService.deleteById = jest.fn().mockResolvedValue(mockOffice);          
            const result = await officeController.deleteOffice(mockOffice._id);
            expect(officeService.deleteById).toHaveBeenCalledWith(mockOffice._id);        
            expect(result).toEqual(mockOffice);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            officeService.deleteById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(officeController.deleteOffice(invalidId)).rejects.toThrow(BadRequestException);
            expect(officeService.deleteById).toHaveBeenCalledWith(invalidId);
        });
      
        // Office not found
        it('should throw NotFoundException if office is not found', async () => {

            officeService.deleteById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(officeController.deleteOffice(mockOffice._id)).rejects.toThrow(NotFoundException);
            expect(officeService.deleteById).toHaveBeenCalledWith(mockOffice._id);
        });
    })
})