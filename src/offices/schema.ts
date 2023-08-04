import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { OfficeType, RentalStatus } from "src/common/enums/office.enum";
import { User } from "src/users/schema";

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

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
    owner: User;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
    renter?: User;
}

export const OfficeSchema = SchemaFactory.createForClass(Office);