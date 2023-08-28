import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from '../users/schema';
import { SchemaTypes } from "mongoose";
import { Document } from "mongoose";

@Schema()
export class Feedback extends Document{

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: User;

  @Prop({ default: null })
  subject?: string;

  @Prop({ required: true })
  message: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

/*

Any field must not be empty (except subject)
userType must be of type UserType
Every field must be checked for datatype (subject, message)

*/