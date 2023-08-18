import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "../services/service";
import { PaymentController } from "./controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { createPaymentDto, createdPayment, mockPayment, updatePaymentDto, updatedPayment } from "../../utlils/payment.mock";
  
describe('PaymentController', () => {

    let paymentService: PaymentService
    let paymentController: PaymentController

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