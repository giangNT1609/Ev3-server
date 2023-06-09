import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduledTaskDocument = ScheduledTask & Document;

@Schema({ versionKey: false })
export class ScheduledTask {
  @Prop({ required: true, unique: true, index: true })
  device: string; // device indentity

  @Prop({ required: true })
  time: string; // time to run the task

  @Prop({ required: true })
  username: string; // username
}

export const ScheduledTaskchema = SchemaFactory.createForClass(ScheduledTask);
