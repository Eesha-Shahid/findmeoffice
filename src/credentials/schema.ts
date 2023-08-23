import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from '../users/schema';
import { Document } from 'mongoose';

@Schema()
export class Credentials extends Document{

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user: User;  

    @Prop({ required: true })
    cardNumber: string;

    @Prop({ required: true })
    cardholderName: string;

    @Prop({ required: true })
    expiryDate: string;

    @Prop({ required: true })
    securityCode: string;
}

export const CredentialsSchema = SchemaFactory.createForClass(Credentials);

/*

Any field must not be empty 
userType must be of type UserType
Every field must be checked for datatype (all string except userType)
security code must be a three digit 
format must be checked (card, expirty date)

*/
