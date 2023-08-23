import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { OfficeType, RentalStatus } from '../common/enums/office.enum';
import { User } from '../users/schema';

@Schema()
export class Office {

    @Prop({ required: true })
    buildingName: string;

    @Prop({ required: true, type: SchemaTypes.Decimal128 })
    buildingSize: number

    @Prop({default: null})
    description?: string

    @Prop({ required: true, type: SchemaTypes.Decimal128})
    monthlyRate: number

    @Prop({ required: true })
    image: string[]

    @Prop({ required: true})
    address: string

    @Prop({ required: true, type: SchemaTypes.Decimal128})
    latitude: number

    @Prop({ required: true, type: SchemaTypes.Decimal128})
    longitude: number

    @Prop({ required: true, enum: Object.values(RentalStatus) })
    rentalStatus: RentalStatus

    @Prop({ required: true, type: [{ type: String, enum: Object.values(OfficeType) }]  })
    officeType: OfficeType[]

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    owner: User;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
    renter?: User;
}

export const OfficeSchema = SchemaFactory.createForClass(Office);

/*

Any field must not be empty (except renter)
rentalStatus must be of type rentalstatus
owner must be of type owner
renter must be of type renter
images must atleast be 3.
officetype must be atleast be 1
Every field must be checked for datatype (string, number)

*/