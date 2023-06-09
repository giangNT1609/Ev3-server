import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, unique: true, index: true })
  username: string; // username create in the first use

  @Prop({ required: true, unique: true, index: true })
  deviceId: string; // device_id of the mobile application

  @Prop({ default: Date.now })
  createAt: number; // time create user in the mobile application
}

export const UserSchema = SchemaFactory.createForClass(User);
