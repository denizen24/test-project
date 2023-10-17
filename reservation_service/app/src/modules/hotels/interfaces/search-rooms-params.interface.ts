import { ID } from "src/types/ID";

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotelId: ID;
  isEnabled?: boolean;
}
