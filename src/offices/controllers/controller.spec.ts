import { Test, TestingModule } from "@nestjs/testing";
import { OfficeService } from "../services/service";
import { OfficeController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { createOfficeDto, createdOffice, mockOffice, updateOfficeDto, updatedOffice } from '../../utlils/office.mock';
  
describe('OfficeController', () => {

    let officeService: OfficeService
    let officeController: OfficeController

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