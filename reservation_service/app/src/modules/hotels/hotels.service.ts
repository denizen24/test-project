import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from "src/types/ID";
import { IHotelsService } from "./interfaces/hotels-service.interface";
import { SearchHotelParams } from "./interfaces/search-hotel-params.interface";
import { Hotel, HotelDocument } from "./mongo.schemas/hotel.schema";

@Injectable()
export class HotelsService implements IHotelsService {
    constructor(
      @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    ) {}

    public async create(data: Partial<Hotel>): Promise<HotelDocument> {
        const model = new this.HotelModel(data);
        await model.save();
        return model;
    }

    async findById(id: ID): Promise<HotelDocument | undefined> {
        return await this.HotelModel.findById(id).select('-__v').exec();
    }

    async search(params: SearchHotelParams): Promise<HotelDocument[]> {
        const { limit, offset, ...queryParams } = params;
        const query = this.HotelModel.find(queryParams);
        limit && query.limit(limit);
        offset && query.skip(offset);
        return await query.select('-__v').exec();
    }

    async update(id: ID, data: UpdateHotelParams): Promise<Hotel | undefined> {
        await this.HotelModel.findByIdAndUpdate(id, data);
        return this.findById(id);
    }
}
