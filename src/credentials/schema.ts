import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/users/schema';

@Schema()
export class Credentials {

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
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
