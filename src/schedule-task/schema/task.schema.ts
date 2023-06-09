import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ versionKey: false })
export class Task {
  @Prop({ required: true })
  device: string; // ev3 device

  @Prop({ required: true })
  time: string; // time to run the task (cronTime) example "30 9 * * * "

  @Prop({ required: true })
  username: string; // username

  @Prop()
  tasks: string; // list of tasks

  @Prop({ default: false })
  isDone: boolean; //check the status of the task is Done or Not
}

export const TaskSchema = SchemaFactory.createForClass(Task);
