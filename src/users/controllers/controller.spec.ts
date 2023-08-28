import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../services/service";
import { UserController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { createUserDto, createdUser, mockUser, updateUserDto, updatedUser } from '../../utlils/user.mock';
  
describe('UserController', () => {

    let userService: UserService
    let userController: UserController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        findAll: jest.fn().mockReturnValue([mockUser]),
                        findById: jest.fn().mockReturnValue(mockUser),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn()
                    }
                }
            ],
        }).compile()

        userService = module.get<UserService>(UserService);
        userController = module.get<UserController>(UserController);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear any calls and reset mock behaviors
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    })

    describe('getUserById', () => {

        //User found
        it('should return an array of users', async() => {
            const result = await userController.getUserById(mockUser._id);
            expect(userService.findById).toHaveBeenCalledWith(mockUser._id);
            expect(result).toEqual(mockUser);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            userService.findById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(userController.getUserById(invalidId)).rejects.toThrow(BadRequestException);
            expect(userService.findById).toHaveBeenCalledWith(invalidId);
        });
      
        // User not found
        it('should throw NotFoundException if user is not found', async () => {

            userService.findById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(userController.getUserById(mockUser._id)).rejects.toThrow(NotFoundException);
            expect(userService.findById).toHaveBeenCalledWith(mockUser._id);
        });
    })

    describe('updateUser', () => {

        it('should update and return a user', async() => {
            
            userService.updateById = jest.fn().mockResolvedValue(updatedUser);          
            const result = await userController.updateUser(updateUserDto, mockUser._id);
            expect(userService.updateById).toHaveBeenCalledWith(
                mockUser._id,
                updateUserDto,
            );        
            expect(result).toEqual(updatedUser);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            userService.updateById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(userController.updateUser(updateUserDto, invalidId)).rejects.toThrow(BadRequestException);
            expect(userService.updateById).toHaveBeenCalledWith(
                invalidId,
                updateUserDto
            );
        });
      
        // User not found
        it('should throw NotFoundException if user is not found', async () => {

            userService.updateById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(userController.updateUser(updateUserDto, mockUser._id)).rejects.toThrow(NotFoundException);
            expect(userService.updateById).toHaveBeenCalledWith(
                mockUser._id,
                updateUserDto
            );
        });
    })

    describe('deleteUser', () => {

        // User found
        it('should delete and return a user', async() => {

            userService.deleteById = jest.fn().mockResolvedValue(mockUser);          
            const result = await userController.deleteUser(mockUser._id);
            expect(userService.deleteById).toHaveBeenCalledWith(mockUser._id);        
            expect(result).toEqual(mockUser);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            userService.deleteById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(userController.deleteUser(invalidId)).rejects.toThrow(BadRequestException);
            expect(userService.deleteById).toHaveBeenCalledWith(invalidId);
        });
      
        // User not found
        it('should throw NotFoundException if user is not found', async () => {

            userService.deleteById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(userController.deleteUser(mockUser._id)).rejects.toThrow(NotFoundException);
            expect(userService.deleteById).toHaveBeenCalledWith(mockUser._id);
        });
    })
})