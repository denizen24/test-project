import { IsDefined, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class UpdateHotelRoomDto {
  @IsString()
  description: string;

  @IsDefined()
  hotelId: ObjectId;

  @IsDefined()
  isEnabled: boolean;

  images: string[];
}
