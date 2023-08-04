import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Feedback {

  @Prop({ default: null })
  subject?: string;

  @Prop({ required: true })
  message: string;
  
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);