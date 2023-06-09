import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TaskDto } from './dto/task.dto';
import { Task, TaskDocument } from './schema/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class ScheduleTaskService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel(Task.name) private readonly model: Model<TaskDocument>,
  ) {}
  async getTaskList(username: string) {
    return await this.model.find({ username: username }).exec();
  }

  async createTask(task: TaskDto) {
    // store in database
    await new this.model({ ...task }).save();

    //create cron task
    const taskName = task.device + '_' + task.time;
    return await this.addCronJob(taskName, task.time, async () => {
      console.log('Cronjob: ' + taskName);
    });
  }

  async updateTask(id: string, task: UpdateTaskDto) {
    return await this.model.findByIdAndUpdate(id, task, { new: true }).exec();
  }

  async deleteTask(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  addCronJob(name: string, date: string | Date, callback: () => void) {
    if (!this.schedulerRegistry.doesExist('cron', name)) {
      const job = new CronJob({
        cronTime: date,
        onTick: callback,
        start: true,
      });
      // const timeout = setInterval(callback, milliseconds);
      this.schedulerRegistry.addCronJob(name, job);
      console.log('added CronJob: ' + name);
    } else {
      throw new BadRequestException('Cronjob exist', {
        cause: new Error(),
        description: 'Bad Request',
      });
    }
  }
}
