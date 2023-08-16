import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from '../users/schema'
import { Credentials } from '../credentials/schema';
import { PaymentMethod } from '../common/enums/payment.enum';

@Schema()
export class Payment {
    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
    user: User;

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Credentials' })
    credentials: Credentials;

    @Prop({ required: true, type: SchemaTypes.Decimal128})
    amount: number;

    @Prop({ type: Date, default: Date.now })
    timestamp: Date;

    @Prop({ required: true, enum: Object.values(PaymentMethod) })
    method: PaymentMethod;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

/*

Any field must not be empty (except timestamp)
user must be of type user
credentials must be of type credentials
method must be of type paymentMethod
Every field must be checked for datatype (remaining is amount, and date)

*/
