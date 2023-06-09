import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DevicesDocument = Devices & Document;

@Schema({ versionKey: false })
export class Devices {
  @Prop({ required: true, unique: true })
  device: string; // device identity

  @Prop({ required: true })
  status: number; // 1: busy, 0: free

  @Prop()
  currentUser: string; // current user
}

export const DevicesSchema = SchemaFactory.createForClass(Devices);
