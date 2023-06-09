import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Devices, DevicesSchema } from './schema/device.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Devices.name,
        useFactory: () => {
          const schema = DevicesSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [MqttController],
  providers: [MqttService],
})
export class MqttModule {}
