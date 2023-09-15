import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { Devices, DevicesDocument } from './schema/device.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { FcmService } from '@doracoder/fcm-nestjs';
// import { messaging } from 'firebase-admin';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MqttService {
  private readonly client: mqtt.MqttClient;
  constructor(
    private configService: ConfigService,
    // private readonly fcmService: FcmService,
    @InjectModel(Devices.name) private readonly model: Model<DevicesDocument>,
    private readonly userService: UserService,
  ) {
    // this.fcmService = fcmService;
    this.configService = configService;
    const brokerUrl = this.configService.get<string>('MQTT_URL');
    this.client = mqtt.connect(brokerUrl);
    this.client.on('connect', async () => {
      console.log(`Connected to ${brokerUrl}`);
      const deviceList = await this.getDevices();
      for (const element of deviceList) {
        this.client.subscribe(element.device, (err) => {
          if (err) {
            console.error(
              `Failed to subscribe to topic "device": ${err.message}`,
            );
          } else {
            console.log(`Subscribed to topic ${element.device}`);
          }
        });
      }
    });
    this.client.on('message', async (topic, message) => {
      console.log(`Received message from topic "${topic}": ${message}`);
      if (message.toString() == 'task completed') {
        const device = await this.getDevice(topic);
        // await this.sendToDevices('Task completed', device.currentUser);
      }
      if (message.toString() == 'Object detected') {
        const device = await this.getDevice(topic);
        // await this.sendToDevices('Object detected', device.currentUser);
      }
    });
  }

  async getDevices() {
    return await this.model.find().exec();
  }

  async getDevice(device: string) {
    return await this.model.findOne({ device: device }).exec();
  }

  async createDevice(device) {
    return await new this.model({ ...device }).save();
  }

  async updateDevice(id, device) {
    return await this.model.findByIdAndUpdate(id, device, { new: true }).exec();
  }

  async deleteDevice(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async sendMessage(
    topic: string,
    message: string,
    callback?: (error?: Error) => void,
  ) {
    await this.client.publish(topic, message, (err) => {
      if (err) {
        console.error(`Failed to send message: ${err.message}`);
        if (callback) {
          callback(err);
        }
      } else {
        console.log(`Sent message "${message}" to topic "${topic}"`);
        if (callback) {
          callback();
        }
      }
    });
  }

  async getStatusDevice(device: string) {
    // read the current status in storage
    const statusList = await this.model.find().exec();
    for (let i = 0; i < statusList.length; i++) {
      if (statusList[i].device === device) {
        return await statusList[i].status;
      }
    }
    throw new HttpException('the device is not exist', 202);
  }

  async openConnection(device: string, username: string) {
    const find = await this.model.findOne({ device: device }).exec();
    if (find != null && find.status == 0) {
      return await this.model
        .findOneAndUpdate(
          { device: device },
          { currentUser: username, status: 1 },
          { new: true },
        )
        .exec();
    } else {
      throw new HttpException(
        'Someone connected to this device. Try again later!',
        202,
      );
    }
  }

  async closeConnection(device: string, username: string) {
    const find = await this.model.findOne({ device: device }).exec();
    console.log(find);
    if (find != null && find.status == 1 && find.currentUser == username) {
      return await this.model
        .findOneAndUpdate(
          { device: device },
          { username: '', status: 0 },
          { new: true },
        )
        .exec();
    } else {
      throw new HttpException('Invalid username! Check username again!', 203);
    }
  }

  // async sendToDevices(message: string, username: string) {
  //   const mobileId = await this.userService.getDeviceId(username);
  //   const payload: messaging.MessagingPayload = {
  //     notification: {
  //       title: 'New Message',
  //       body: 'You have a new message!',
  //     },
  //     data: {
  //       type: 'message',
  //       sender: username,
  //       message: message,
  //     },
  //   };
  //   return await this.fcmService.sendNotification([mobileId], payload, false);
  // }
}
