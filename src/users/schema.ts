import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserType } from '../common/enums/user.enum';

@Schema({ timestamps: true })
export class User{

  @Prop()
  stripeCustomerId: string;
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: null })
  profilePic?: string;

  @Prop({ required: true, enum: Object.values(UserType) })
  userType: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);

/*

Any field must not be empty (except profilePic)
userType must be of type UserType
Every field must be checked for datatype (all string except userType)
format must be checked (email, phone number)

*/