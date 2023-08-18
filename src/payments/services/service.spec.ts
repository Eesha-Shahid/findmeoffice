import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { Payment } from '../schema';
import { PaymentService } from './service';
import { createPaymentDto, createdPayment, mockPayment, updatePaymentDto, updatedPayment } from '../../utlils/payment.mock';

describe('PaymentService', () => {

    let paymentService: PaymentService
    let mockPaymentModel: Model<Payment>;

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
            await expect(paymentService.updateById(invalidId, updatePaymentDto)).rejects.toThrow(BadRequestException);
        });
      
        // Payment not found
        it('should throw NotFoundException if payment does not exist', async () => {
        
            mockPaymentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
        
            await expect(paymentService.updateById(mockPayment._id, updatePaymentDto)).rejects.toThrow(
              NotFoundException
            );
        });  
    });
} )