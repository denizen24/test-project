import { ID } from "src/types/ID";
import { Hotel } from "../mongo.schemas/hotel.schema";
import { SearchHotelParams } from "./search-hotel-params.interface";

export interface IHotelsService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}
