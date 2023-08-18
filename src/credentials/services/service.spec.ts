import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { Credentials } from '../schema';
import { CredentialsService } from './service';
import { createCredentialsDto, createdCredentials, mockCredentials, updateCredentialsDto, updatedCredentials } from '../../utlils/credentials.mock';
  
describe('CredentialsService', () => {

    let credentialsService: CredentialsService
    let mockCredentialsModel: Model<Credentials>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CredentialsService,
                {
                    provide: getModelToken(Credentials.name),
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

        credentialsService = module.get<CredentialsService>(CredentialsService);
        mockCredentialsModel = module.get<Model<Credentials>>(getModelToken(Credentials.name));
    })

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('create', () => {

        // Successful credentials creation
        it('should create an credentials with the provided owner', async () => {
        
            mockCredentialsModel.create = jest.fn().mockResolvedValue(createdCredentials);        
            const result = await credentialsService.create(createCredentialsDto);
            expect(mockCredentialsModel.create).toHaveBeenCalledWith(createCredentialsDto);        
            expect(result).toEqual(createdCredentials);
        });
    });
    

    describe('findAll', () => {

        it('should return an array of credentialss', async () => {

        mockCredentialsModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockCredentials]),
        });

        const result = await credentialsService.findAll();
        expect(mockCredentialsModel.find).toHaveBeenCalled();
        expect(result).toEqual([mockCredentials]);
      });
    });

    describe('findById', () => {

        // Credentials found
        it('should return a credentials by ID', async() => {

            mockCredentialsModel.findById = jest.fn().mockResolvedValue(mockCredentials)
            const result = await credentialsService.findById(mockCredentials._id);
            expect(mockCredentialsModel.findById).toHaveBeenCalledWith(mockCredentials._id);
            expect(result).toEqual(mockCredentials)
        })

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(credentialsService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
      
        // Credentials not found
        it('should throw NotFoundException if credentials is not found', async () => {

            mockCredentialsModel.findById = jest.fn().mockResolvedValue(null);
            await expect(credentialsService.findById(mockCredentials._id)).rejects.toThrow(NotFoundException,);
            expect(mockCredentialsModel.findById).toHaveBeenCalledWith(mockCredentials._id);
        });
    })

    describe('deleteById', () => {

        // Credentials found
        it('should delete and return a credentials', async () => {

            mockCredentialsModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockCredentials);
            const result = await credentialsService.deleteById(mockCredentials._id);
            expect(mockCredentialsModel.findByIdAndDelete).toHaveBeenCalledWith(mockCredentials._id);
            expect(result).toEqual(mockCredentials);
        });

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(credentialsService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
    
        // Credentials not found
        it('should throw NotFoundException if credentials does not exist', async () => {

            mockCredentialsModel.findByIdAndDelete = jest.fn().mockResolvedValue(null); 
            await expect(credentialsService.deleteById(mockCredentials._id)).rejects.toThrow(NotFoundException);
            expect(mockCredentialsModel.findByIdAndDelete).toHaveBeenCalledWith(mockCredentials._id);
        });
    });

    describe('updateById', () => {

        // Credentials found
        it('should update and return a credentials', async () => {
        
            mockCredentialsModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedCredentials),
            });
            
            const result = await credentialsService.updateById(mockCredentials._id, updateCredentialsDto);
            expect(mockCredentialsModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockCredentials._id,
                updateCredentialsDto,
                { new: true }
            );
            expect(result).toEqual(updatedCredentials);
        });
      
        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {
            const invalidId = 'invalid-id';
          
            await expect(credentialsService.updateById(invalidId, updateCredentialsDto)).rejects.toThrow(BadRequestException);
        });
      
        // Credentials not found
        it('should throw NotFoundException if credentials does not exist', async () => {
        
            mockCredentialsModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
        
            await expect(credentialsService.updateById(mockCredentials._id, updateCredentialsDto)).rejects.toThrow(
              NotFoundException
            );
        });  
    });
} )