import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Hotel {
  @Prop({ required: true, unique: false })
  title: string;

  @Prop({ required: false, unique: false })
  description: string;

  @Prop({ required: true, unique: false })
  createdAt: Date;

  @Prop({ required: true, unique: false })
  updatedAt: Date;
}

export type HotelDocument = HydratedDocument<Hotel>;
export const HotelSchema = SchemaFactory.createForClass(Hotel);
