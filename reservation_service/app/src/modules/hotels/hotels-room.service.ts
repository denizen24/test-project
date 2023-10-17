import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from "src/types/ID";
import { IHotelsRoomService } from "./interfaces/hotels-room-service.interface";
import { SearchRoomsParams } from "./interfaces/search-rooms-params.interface";
import { HotelRoom, HotelRoomDocument } from "./mongo.schemas/hotel-room.schema";

@Injectable()
export class HotelsRoomService implements IHotelsRoomService {
    constructor(
      @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    ) {}

    public async create(data: Partial<HotelRoom>): Promise<HotelRoomDocument> {
        const model = new this.HotelRoomModel(data);
        await model.save();
        return await this.findById(model.id);
    }

    async findById(id: ID): Promise<HotelRoomDocument | undefined> {
        return await this.HotelRoomModel.findById(id).populate('hotel').select('-__v').exec();
    }

    async search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
        if (params.isEnabled === undefined) {
            delete params.isEnabled;
        }
        return await this.HotelRoomModel.find(params).populate('hotel').select('-__v').exec();
    }

    async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoomDocument | undefined> {
        data.updatedAt = new Date();
        await this.HotelRoomModel.findByIdAndUpdate(id, data);
        return await this.findById(id);
    }
}
