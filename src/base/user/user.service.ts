import { Model } from 'mongoose';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    try {
      const user = new this.model(data);

      return await user.save();
    } catch (e) {
      if (e.code === 11000 && e.keyValue.email) {
        throw new ConflictException(
          `User with email ${e.keyValue.email} already exists`,
        );
      }
    }
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.model.findById(id);

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.model.findOne({
      email: { $regex: email, $options: 'i' },
    });

    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    const users = await this.model.find();

    return users;
  }

  async search(params: SearchUserParams): Promise<UserDocument[]> {
    const query: { [key: string]: any } = {};

    if (params.contactPhone) {
      query.contactPhone = { $regex: params.contactPhone, $options: 'i' };
    }

    if (params.name) {
      query.name = { $regex: params.name, $options: 'i' };
    }

    if (params.email) {
      query.email = { $regex: params.email, $options: 'i' };
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    if (params.limit) {
      query.limit(params.limit);
    }

    return await this.model.find(query);
  }
}
