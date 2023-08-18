import { Schema } from "mongoose";
import { mockCredentials } from "./credentials.mock";
import { mockUser } from "./user.mock";
import { PaymentMethod } from "../common/enums/payment.enum";

export const mockPayment = {
    _id:  '64c7a679089d68e416069f40',
    user: mockUser,
    credentials: mockCredentials,
    amount: new Schema.Types.Decimal128('12000'),
    method: PaymentMethod.CreditCard
};

export const createPaymentDto = {
    user: mockUser,
    credentials: mockCredentials,
    amount: new Schema.Types.Decimal128('12000'),
    method: PaymentMethod.CreditCard
};

export const createdPayment = {
    _id: '64c7a679089d68e316069f40',
    ...createPaymentDto,
};

export const updatePaymentDto = {
    amount: new Schema.Types.Decimal128('5000'),
    method: PaymentMethod.BankTransfer
};

export const updatedPayment = {
    ...mockPayment,
    amount: new Schema.Types.Decimal128('5000'),
    method: PaymentMethod.BankTransfer
};