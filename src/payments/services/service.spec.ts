import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { Payment } from '../schema';
import { PaymentService } from './service';

enum UserType {
    Renter = 'renter',
    Owner = 'owner',
}

enum PaymentMethod {
    CreditCard= "Credit Card",
    BankTransfer= "Bank Transfer",
    PayPal= "PayPal"
}

describe('PaymentService', () => {

    let paymentService: PaymentService
    let mockPaymentModel: Model<Payment>;

    const mockUser = {
        _id:  '64c7a679089d68e316069f40',
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
            providers: [
                PaymentService,
                {
                    provide: getModelToken(Payment.name),
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

        paymentService = module.get<PaymentService>(PaymentService);
        mockPaymentModel = module.get<Model<Payment>>(getModelToken(Payment.name));
    })

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('create', () => {

        // Successful payment creation
        it('should create an payment with the provided owner', async () => {

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
        
            mockPaymentModel.create = jest.fn().mockResolvedValue(createdPayment);        
            const result = await paymentService.create(createPaymentDto);
            expect(mockPaymentModel.create).toHaveBeenCalledWith(createPaymentDto);        
            expect(result).toEqual(createdPayment);
        });
    });
    

    describe('findAll', () => {

        it('should return an array of payments', async () => {

        mockPaymentModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockPayment]),
        });

        const result = await paymentService.findAll();
        expect(mockPaymentModel.find).toHaveBeenCalled();
        expect(result).toEqual([mockPayment]);
      });
    });

    describe('findById', () => {

        // Payment found
        it('should return a payment by ID', async() => {

            mockPaymentModel.findById = jest.fn().mockResolvedValue(mockPayment)
            const result = await paymentService.findById(mockPayment._id);
            expect(mockPaymentModel.findById).toHaveBeenCalledWith(mockPayment._id);
            expect(result).toEqual(mockPayment)
        })

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(paymentService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
      
        // Payment not found
        it('should throw NotFoundException if payment is not found', async () => {

            mockPaymentModel.findById = jest.fn().mockResolvedValue(null);
            await expect(paymentService.findById(mockPayment._id)).rejects.toThrow(NotFoundException,);
            expect(mockPaymentModel.findById).toHaveBeenCalledWith(mockPayment._id);
        });
    })

    describe('deleteById', () => {

        // Payment found
        it('should delete and return a payment', async () => {

            mockPaymentModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockPayment);
            const result = await paymentService.deleteById(mockPayment._id);
            expect(mockPaymentModel.findByIdAndDelete).toHaveBeenCalledWith(mockPayment._id);
            expect(result).toEqual(mockPayment);
        });

        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {

            const invalidId = 'invalid-id';
            await expect(paymentService.deleteById(invalidId)).rejects.toThrow(BadRequestException);
        });
    
        // Payment not found
        it('should throw NotFoundException if payment does not exist', async () => {

            mockPaymentModel.findByIdAndDelete = jest.fn().mockResolvedValue(null); 
            await expect(paymentService.deleteById(mockPayment._id)).rejects.toThrow(NotFoundException);
            expect(mockPaymentModel.findByIdAndDelete).toHaveBeenCalledWith(mockPayment._id);
        });
    });

    describe('updateById', () => {

        // Payment found
        it('should update and return a payment', async () => {
            const updatePaymentDto = {
                amount: new Schema.Types.Decimal128('5000'),
                method: PaymentMethod.BankTransfer
            };
        
            const updatedPayment = {
                _id: mockPayment._id,
                user: mockUser,
                credentials: mockCredentials,
                amount: new Schema.Types.Decimal128('5000'),
                method: PaymentMethod.BankTransfer
            };
        
            mockPaymentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedPayment),
            });
            
            const result = await paymentService.updateById(mockPayment._id, updatePaymentDto);
            expect(mockPaymentModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockPayment._id,
                updatePaymentDto,
                { new: true }
            );
            expect(result).toEqual(updatedPayment);
        });
      
        // Invalid ID
        it('should throw BadRequestException if invalid ID is provided', async () => {
            const invalidId = 'invalid-id';
            const updatePaymentDto = {
                amount: new Schema.Types.Decimal128('5000'),
                method: PaymentMethod.BankTransfer
            };
          
            await expect(paymentService.updateById(invalidId, updatePaymentDto)).rejects.toThrow(BadRequestException);
        });
      
        // Payment not found
        it('should throw NotFoundException if payment does not exist', async () => {
            const updatePaymentDto = {
                amount: new Schema.Types.Decimal128('5000'),
                method: PaymentMethod.BankTransfer
            };
        
            mockPaymentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
        
            await expect(paymentService.updateById(mockPayment._id, updatePaymentDto)).rejects.toThrow(
              NotFoundException
            );
        });  
    });
} )