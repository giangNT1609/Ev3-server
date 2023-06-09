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
import { MqttService } from './mqtt.service';
import { MessageDto } from './dto/message.dto';
import { QueryDto } from './dto/queryDevice.dto';
import { ConnectionDto } from './dto/connection.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeviceDto } from './dto/device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@ApiTags('MQTT')
@Controller('mqtt')
export class MqttController {
  constructor(private readonly service: MqttService) {}

  @Get()
  async getDevices() {
    return await this.service.getDevices();
  }

  @Get('status')
  async getStatus(@Query() query: QueryDto) {
    return await this.service.getStatusDevice(query.device);
  }

  @Post('create')
  async createDevice(@Body() body: DeviceDto) {
    return await this.service.createDevice(body);
  }

  @Post('connect')
  async connectToDevice(@Body() body: ConnectionDto) {
    return await this.service.openConnection(body.device, body.username);
  }

  @Post('disconnect')
  async disconnectToDevice(@Body() body: ConnectionDto) {
    return await this.service.closeConnection(body.device, body.username);
  }

  @Post('sendMessage')
  async sendMessage(@Body() body: MessageDto) {
    return await this.service.sendMessage(body.topic, body.message);
  }

  @Put(':id')
  async updateDevice(@Param('id') id: string, @Body() device: UpdateDeviceDto) {
    return await this.service.updateDevice(id, device);
  }

  @Delete(':id')
  async deleteDevice(@Param('id') id: string) {
    return await this.service.deleteDevice(id);
  }
}
