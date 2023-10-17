import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { UserRoleEnum } from "src/enums/user-role.enum";
import { ID } from "src/types/ID";
import { HotelsRoomFormatter } from "./hotels-room.formatter";
import { HotelsRoomService } from "./hotels-room.service";
import { SearchRoomsParams } from "./interfaces/search-rooms-params.interface";

@Controller('/api/common/hotel-rooms')
export class HotelRoomsCommonController {
  constructor(
    private hotelsRoomService: HotelsRoomService,
    private hotelsRoomFormatter: HotelsRoomFormatter,
  ) {}

  @Get("/")
  async hotelRooms(@Query() query: SearchRoomsParams, @Request() req: any) {
    if (!req.user || [UserRoleEnum.client].includes(req.user.role)) {
      query.isEnabled = true;
    }
    const rooms = await this.hotelsRoomService.search(query);
    return rooms.map(room => this.hotelsRoomFormatter.format(room));
  }

  @Get("/:id")
  async hotelRoom(@Param('id') id: ID) {
    const room = await this.hotelsRoomService.findById(id);
    return room ? this.hotelsRoomFormatter.format(room) : {};
  }
}
