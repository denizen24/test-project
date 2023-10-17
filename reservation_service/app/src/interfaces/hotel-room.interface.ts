import { ID } from "src/types/ID";

export interface iHotelRoom {
  hotelId: ID;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}
