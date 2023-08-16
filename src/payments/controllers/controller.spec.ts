import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "../services/service";
import { PaymentController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Schema } from "mongoose";

enum UserType {
    Renter = 'renter',
    Owner = 'owner',
}

enum PaymentMethod {
    CreditCard= "Credit Card",
    BankTransfer= "Bank Transfer",
    PayPal= "PayPal"
}
  
describe('PaymentController', () => {

    let paymentService: PaymentService
    let paymentController: PaymentController

    const mockUser = {
        _id:  '64c7a679089d68e116069f40',
        name: 'John Doe',
        email: 'johnn.doe@example.com',
        phoneNumber: '03355989889',
        profilePic: null,
        userType: UserType.Renter
    }

    const mockCredentials = {
        _id:  '64c7a679089d68e216069f40',
        user: mockUser,
        cardNumber: '379354508162306',
        cardholderName: 'John Doe',
        expiryDate: '2020-02-31',
        securityCode: '333',
    }

    const mockPayment = {
        _id:  '64c7a679089d68e416069f40',
        user: mockUser,
        credentials: mockCredentials,
        amount: new Schema.Types.Decimal128('12000'),
        method: PaymentMethod.CreditCard
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentController],
            providers: [
                {
                    provide: PaymentService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn().mockReturnValue([mockPayment]),
                        findById: jest.fn().mockReturnValue(mockPayment),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn()
                    }
                }
            ],
        }).compile()

        paymentService = module.get<PaymentService>(PaymentService);
        paymentController = module.get<PaymentController>(PaymentController);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear any calls and reset mock behaviors
    });

    it('should be defined', () => {
        expect(paymentController).toBeDefined();
    })

    describe('createPayment', () => {
        it('should create a payment', async() => {

            const createPaymentDto = {
                user: mockUser,
                credentials: mockCredentials,
                amount: new Schema.Types.Decimal128('12000'),
                method: PaymentMethod.CreditCard
            };
        
            const createdPayment = {
                _id: '64c7a679089d68e316069f40',
                ...createPaymentDto,
            };
        
            // Mock the create method to return the created payment
            paymentService.create = jest.fn().mockResolvedValue(createdPayment);          

            // Call the createPayment method and perform assertions
            const result = await paymentController.createPayment(createPaymentDto);
            expect(paymentService.create).toHaveBeenCalledWith(createPaymentDto);        
            expect(result).toEqual(createdPayment);
        })
    })

    describe('getAllPayments', () => {
        it('should return an array of payments', async() => {
            const result = await paymentController.getAllPayments();
            expect(paymentService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockPayment]);
        })
    })

    describe('getPaymentById', () => {

        //Payment found
        it('should return an array of payments', async() => {
            const result = await paymentController.getPaymentById(mockPayment._id);
            expect(paymentService.findById).toHaveBeenCalledWith(mockPayment._id);
            expect(result).toEqual(mockPayment);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            paymentService.findById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(paymentController.getPaymentById(invalidId)).rejects.toThrow(BadRequestException);
            expect(paymentService.findById).toHaveBeenCalledWith(invalidId);
        });
      
        // Payment not found
        it('should throw NotFoundException if payment is not found', async () => {

            paymentService.findById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(paymentController.getPaymentById(mockPayment._id)).rejects.toThrow(NotFoundException);
            expect(paymentService.findById).toHaveBeenCalledWith(mockPayment._id);
        });
    })

    describe('updatePayment', () => {

        const updatePaymentDto = {
            amount: new Schema.Types.Decimal128('5000'),
            method: PaymentMethod.BankTransfer
        };
    
        const updatedPayment = {
            ...mockPayment,
            amount: new Schema.Types.Decimal128('5000'),
            method: PaymentMethod.BankTransfer
        };

        it('should update and return a payment', async() => {
            
            paymentService.updateById = jest.fn().mockResolvedValue(updatedPayment);          
            const result = await paymentController.updatePayment(mockPayment._id, updatePaymentDto);
            expect(paymentService.updateById).toHaveBeenCalledWith(
                mockPayment._id,
                updatePaymentDto,
            );        
            expect(result).toEqual(updatedPayment);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            paymentService.updateById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(paymentController.updatePayment(invalidId, updatePaymentDto)).rejects.toThrow(BadRequestException);
            expect(paymentService.updateById).toHaveBeenCalledWith(
                invalidId,
                updatePaymentDto
            );
        });
      
        // Payment not found
        it('should throw NotFoundException if payment is not found', async () => {

            paymentService.updateById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(paymentController.updatePayment(mockPayment._id, updatePaymentDto)).rejects.toThrow(NotFoundException);
            expect(paymentService.updateById).toHaveBeenCalledWith(
                mockPayment._id,
                updatePaymentDto
            );
        });
    })

    describe('deletePayment', () => {

        // Payment found
        it('should delete and return a payment', async() => {

            paymentService.deleteById = jest.fn().mockResolvedValue(mockPayment);          
            const result = await paymentController.deletePayment(mockPayment._id);
            expect(paymentService.deleteById).toHaveBeenCalledWith(mockPayment._id);        
            expect(result).toEqual(mockPayment);
        })

        // Invalid ID
        it('should throw BadRequestException if an invalid ID is provided', async () => {

            const invalidId = 'invalid_id';
            paymentService.deleteById = jest.fn().mockRejectedValueOnce(new BadRequestException());
            await expect(paymentController.deletePayment(invalidId)).rejects.toThrow(BadRequestException);
            expect(paymentService.deleteById).toHaveBeenCalledWith(invalidId);
        });
      
        // Payment not found
        it('should throw NotFoundException if payment is not found', async () => {

            paymentService.deleteById = jest.fn().mockRejectedValueOnce(new NotFoundException());
            await expect(paymentController.deletePayment(mockPayment._id)).rejects.toThrow(NotFoundException);
            expect(paymentService.deleteById).toHaveBeenCalledWith(mockPayment._id);
        });
    })
})