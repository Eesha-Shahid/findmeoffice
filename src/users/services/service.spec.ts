import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../schema';
import { UserService } from './service';

enum UserType {
    Renter = 'renter',
    Owner = 'owner',
}
  
describe('UserService', () => {

    let userService: UserService
    let mockUserModel: Model<User>;

    const mockUser = {
        _id:  '64c7a679089d68e116069f40',
        name: 'John Doe',
        email: 'johnn.doe@example.com',
        phoneNumber: '03355989889',
        profilePic: null,
        userType: UserType.Renter
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),

                    // Mocked functions
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

        userService = module.get<UserService>(UserService);
        mockUserModel = module.get<Model<User>>(getModelToken(User.name));
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear any calls and reset mock behaviors
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    })

    describe('create', () => {

        // Successful user creation
        it('should create a user', async () => {

            const createUserDto = {
              name: 'John Doe',
              email: 'john.doe@example.com',
              phoneNumber: '03355989889',
              profilePic: null,
              userType: UserType.Renter,
            };
        
            const createdUser = {
              _id: '64c7a679089d68e116069f40',
              ...createUserDto,
            };
        
            // Mocking the create method to return a resolved promise with the createdUser
            mockUserModel.create = jest.fn().mockResolvedValue(createdUser);
        
            // Calling the userService's create method
            const result = await userService.create(createUserDto);
            expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);        
            expect(result).toEqual(createdUser);
        });
    
        // Duplicate email error
        it('should throw ConflictException if user with email already exists', async () => {

            const createUserDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phoneNumber: '03355989889',
                profilePic: null,
                userType: UserType.Renter,
            };
    
            // to return a rejected promise
            mockUserModel.create = jest.fn().mockRejectedValue({ code: 11000 });
            await expect(userService.create(createUserDto)).rejects.toThrow(ConflictException);
            expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
        });
    });
    

    describe('findAll', () => {
        it('should return an array of users', async () => {

        // find returns a query object
        // 'exec' executes the query and retrieves the results
        mockUserModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockUser]),
        });

        const result = await userService.findAll();
        expect(mockUserModel.find).toHaveBeenCalled();
        expect(result).toEqual([mockUser]);
      });
    });

    describe('findById', () => {

        // User found
        it('should return a user by ID', async() => {

            mockUserModel.findById = jest.fn().mockResolvedValue(mockUser)
            const result = await userService.findById(mockUser._id);
            expect(mockUserModel.findById).toHaveBeenCalledWith(mockUser._id);
            expect(result).toEqual(mockUser)
        })

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(userService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
      
        // User not found
        it('should throw NotFoundException if user is not found', async () => {

            mockUserModel.findById = jest.fn().mockResolvedValue(null);
            await expect(userService.findById(mockUser._id)).rejects.toThrow(NotFoundException,);
            expect(mockUserModel.findById).toHaveBeenCalledWith(mockUser._id);
        });
    })

    describe('deleteById', () => {

        // User found
        it('should delete and return a user', async () => {

            mockUserModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);
            const result = await userService.deleteById(mockUser._id);
            expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id);
            expect(result).toEqual(mockUser);
        });

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(userService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
    
        // User not found
        it('should throw NotFoundException if user does not exist', async () => {

            mockUserModel.findByIdAndDelete = jest.fn().mockResolvedValue(null); 
            await expect(userService.deleteById(mockUser._id)).rejects.toThrow(NotFoundException);
            expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id);
        });
    });

    describe('updateById', () => {

        // User found
        it('should update and return a user', async () => {
            const updateUserDto = {
                name: 'Updated Name',
                phoneNumber: '03340111774',
            };
        
            const updatedUser = {
                _id: mockUser._id,
                name: 'Updated Name',
                email: 'john.doe@example.com', 
                phoneNumber: '03340111774',
                profilePic: null,
                userType: UserType.Renter,
            };
        
            mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedUser),
            });
            
            const result = await userService.updateById(mockUser._id, updateUserDto);
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockUser._id,
                updateUserDto,
                { new: true }
            );
            expect(result).toEqual(updatedUser);
        });
      
        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {
            const invalidId = 'invalid-id';
            const updateUserDto = {
                name: 'Updated Name',
                phoneNumber: '9876543210',
            };
          
            await expect(userService.updateById(invalidId, updateUserDto)).rejects.toThrow(BadRequestException);
        });
      
        // User not found
        it('should throw NotFoundException if user does not exist', async () => {
            const updateUserDto = {
              name: 'Updated Name',
              phoneNumber: '9876543210',
            };
        
            mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
        
            await expect(userService.updateById(mockUser._id, updateUserDto)).rejects.toThrow(
              NotFoundException
            );
        });  
    });

} )