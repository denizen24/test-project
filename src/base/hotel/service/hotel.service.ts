import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ID } from '@common/types';

import { Hotel, HotelDocument } from '../schema/hotel.schema';

@Injectable()
export class HotelService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private model: Model<Hotel>) {}

  async create(data: any): Promise<HotelDocument> {
    const hotel = new this.model({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await hotel.save();
  }

  async findById(id: ID): Promise<HotelDocument> {
    const hotel = await this.model.findById(id);

    return hotel;
  }

  async search(params: SearchHotelParams): Promise<HotelDocument[]> {
    const query = this.model.find();

    if (!params.title) {
      query.where({ title: { $regex: params.title, $options: 'i' } });
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    if (params.limit) {
      query.limit(params.limit);
    }

    return await query.exec();
  }

  async update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
    const hotel = await this.model.findByIdAndUpdate(id, data);

    return hotel;
  }
}
