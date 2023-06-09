import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { ScheduleTaskController } from './schedule-task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Task.name,
        useFactory: () => {
          const schema = TaskSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [ScheduleTaskController],
  providers: [ScheduleTaskService],
})
export class ScheduleTaskModule {}
