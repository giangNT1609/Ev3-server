import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async getUsers() {
    return await this.model.find().exec();
  }

  async getDeviceId(username) {
    const device = await this.model.findOne({ username: username }).exec();
    return device.deviceId;
  }

  async createUser(user: UserDto) {
    return await new this.model({ ...user }).save();
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    return await this.model
      .findByIdAndUpdate(id, updateUser, { new: true })
      .exec();
  }

  async deleteUser(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
