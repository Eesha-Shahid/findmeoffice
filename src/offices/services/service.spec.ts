import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Office } from '../schema';
import { OfficeService } from './service';
import { mockOffice, createOfficeDto, createdOffice, updatedOffice, updateOfficeDto } from '../../utlils/office.mock';
  
describe('OfficeService', () => {

    let officeService: OfficeService
    let mockOfficeModel: Model<Office>;

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
            await expect(officeService.updateById(invalidId, updateOfficeDto)).rejects.toThrow(BadRequestException);
        });
      
        // Office not found
        it('should throw NotFoundException if office does not exist', async () => {
        
            mockOfficeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
        
            await expect(officeService.updateById(mockOffice._id, updateOfficeDto)).rejects.toThrow(
              NotFoundException
            );
        });  
    });
} )