import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  device: string; // device indentity

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  time: string; // time to run the task (cronTime)

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string; // username

  @ApiProperty()
  @IsNotEmpty()
  tasks: string; // list of task
}
