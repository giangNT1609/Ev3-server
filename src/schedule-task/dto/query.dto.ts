import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string; // username
}
