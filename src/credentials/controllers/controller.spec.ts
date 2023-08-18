import { Test, TestingModule } from "@nestjs/testing";
import { CredentialsService } from "../services/service";
import { CredentialsController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { createCredentialsDto, createdCredentials, mockCredentials, updateCredentialsDto, updatedCredentials } from '../../utlils/credentials.mock';
  
describe('CredentialsController', () => {

    let credentialsService: CredentialsService
    let credentialsController: CredentialsController 

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CredentialsController],
            providers: [
                {
                    provide: CredentialsService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn().mockReturnValue([mockCredentials]),
                        findById: jest.fn().mockReturnValue(mockCredentials),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn()
                    }
                }
            ],
        }).compile()

        credentialsService = module.get<CredentialsService>(CredentialsService);
        credentialsController = module.get<CredentialsController>(CredentialsController);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear any calls and reset mock behaviors
    });

    it('should be defined', () => {
        expect(credentialsController).toBeDefined();
    })

    describe('createCredentials', () => {
        it('should create a credentials', async() => {
        
            // Mock the create method to return the created credentials
            credentialsService.create = jest.fn().mockResolvedValue(createdCredentials);          

            // Call the createCredentials method and perform assertions
            const result = await credentialsController.createCredentials(createCredentialsDto);
            expect(credentialsService.create).toHaveBeenCalledWith(createCredentialsDto);        
            expect(result).toEqual(createdCredentials);
        })
    })

    describe('getAllCredentialss', () => {
        it('should return an array of credentialss', async() => {
            const result = await credentialsController.getAllCredentialss();
            expect(credentialsService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockCredentials]);
        })
    })

    describe('getCredentialsById', () => {

        //Credentials found
        it('should return an array of credentialss', async() => {
            const result = await credentialsController.getCredentialsById(mockCredentials._id);
            expect(credentialsService.findById).toHaveBeenCalledWith(mockCredentials._id);
            expect(result).toEqual(mockCredentials);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            credentialsService.findById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(credentialsController.getCredentialsById(invalidId)).rejects.toThrow(BadRequestException);
            expect(credentialsService.findById).toHaveBeenCalledWith(invalidId);
        });
      
        // Credentials not found
        it('should throw NotFoundException if credentials is not found', async () => {

            credentialsService.findById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(credentialsController.getCredentialsById(mockCredentials._id)).rejects.toThrow(NotFoundException);
            expect(credentialsService.findById).toHaveBeenCalledWith(mockCredentials._id);
        });
    })

    describe('updateCredentials', () => {

        it('should update and return a credentials', async() => {
            
            credentialsService.updateById = jest.fn().mockResolvedValue(updatedCredentials);          
            const result = await credentialsController.updateCredentials(mockCredentials._id, updateCredentialsDto);
            expect(credentialsService.updateById).toHaveBeenCalledWith(
                mockCredentials._id,
                updateCredentialsDto,
            );        
            expect(result).toEqual(updatedCredentials);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            credentialsService.updateById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(credentialsController.updateCredentials(invalidId, updateCredentialsDto)).rejects.toThrow(BadRequestException);
            expect(credentialsService.updateById).toHaveBeenCalledWith(
                invalidId,
                updateCredentialsDto
            );
        });
      
        // Credentials not found
        it('should throw NotFoundException if credentials is not found', async () => {

            credentialsService.updateById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(credentialsController.updateCredentials(mockCredentials._id, updateCredentialsDto)).rejects.toThrow(NotFoundException);
            expect(credentialsService.updateById).toHaveBeenCalledWith(
                mockCredentials._id,
                updateCredentialsDto
            );
        });
    })

    describe('deleteCredentials', () => {

        // Credentials found
        it('should delete and return a credentials', async() => {

            credentialsService.deleteById = jest.fn().mockResolvedValue(mockCredentials);          
            const result = await credentialsController.deleteCredentials(mockCredentials._id);
            expect(credentialsService.deleteById).toHaveBeenCalledWith(mockCredentials._id);        
            expect(result).toEqual(mockCredentials);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            credentialsService.deleteById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(credentialsController.deleteCredentials(invalidId)).rejects.toThrow(BadRequestException);
            expect(credentialsService.deleteById).toHaveBeenCalledWith(invalidId);
        });
      
        // Credentials not found
        it('should throw NotFoundException if credentials is not found', async () => {

            credentialsService.deleteById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(credentialsController.deleteCredentials(mockCredentials._id)).rejects.toThrow(NotFoundException);
            expect(credentialsService.deleteById).toHaveBeenCalledWith(mockCredentials._id);
        });
    })
})