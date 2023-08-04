import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserType } from '../common/enums/user.enum';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: null })
  profilePic?: string;

  @Prop({ required: true, enum: Object.values(UserType) })
  userType: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);

/*

Duplicate email crashes the app.

*/