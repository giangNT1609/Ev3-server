import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  topic: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
