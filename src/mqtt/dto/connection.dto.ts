import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  device: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;
}
