import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DeviceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  device: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currentUser: string;
}
