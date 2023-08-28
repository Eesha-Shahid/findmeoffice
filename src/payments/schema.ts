import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({ timestamps: true })
export class Payment{

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'User' })
  user: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Office' })
  office: string;

  @Prop()
  amount?: number;

  @Prop({ required: true })
  paymentMethod: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);