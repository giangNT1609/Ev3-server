import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryDto } from './dto/query.dto';

@ApiTags('Schedule-task')
@Controller('schedule-task')
export class ScheduleTaskController {
  constructor(private readonly scheduleTaskService: ScheduleTaskService) {}

  @Get()
  async getTaskList(@Query() query: QueryDto) {
    return this.scheduleTaskService.getTaskList(query.username);
  }

  @ApiOperation({
    description: `Crontime string e.g: "30 9 * * *" \n goto https://crontab.guru/ to decode the time`,
  })
  @Post()
  async createTask(@Body() task: TaskDto) {
    return this.scheduleTaskService.createTask(task);
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() task: UpdateTaskDto) {
    return this.scheduleTaskService.updateTask(id, task);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.scheduleTaskService.deleteTask(id);
  }
}
