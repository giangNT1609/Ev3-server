import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ScheduleTaskModule } from './schedule-task/schedule-task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FcmModule } from '@doracoder/fcm-nestjs';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
        dbName: configService.get<string>('DATABASE_DB'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MqttModule,
    UserModule,
    ScheduleTaskModule,
    ScheduleModule.forRoot(),
    FcmModule.forRoot({
      firebaseSpecsPath: path.join(
        __dirname,
        '../gobot-f7630-firebase-adminsdk.json',
      ),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
