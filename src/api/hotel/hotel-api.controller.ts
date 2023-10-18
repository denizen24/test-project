import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  UseInterceptors,
  UploadedFiles,
  SerializeOptions,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer';

import { PUBLIC_DIR } from '@common/constants';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { HotelDTO, HotelRoomDTO } from '@common/dto';
import { USER_ROLE } from '@common/enums';
import { MongooseClassSerializerInterceptor } from '@common/interceptors';
import { ID } from '@common/types';

import { HotelService, HotelRoomService } from '@base/hotel/service';

@Controller()
@SerializeOptions({ strategy: 'excludeAll' })
export class HotelApiController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('common/hotel-rooms')
  @UseInterceptors(MongooseClassSerializerInterceptor(HotelRoomDTO))
  async getHotelRooms(
    @Query() query: SearchRoomsParams,
    @CurrentUser() user: IUser,
  ) {
    let { isEnabled } = query;

    if (!user || user?.role == USER_ROLE.CLIENT) {
      isEnabled = true;
    }

    return await this.hotelRoomService.search({
      ...query,
      isEnabled,
    });
  }

  @Get('common/hotel-rooms/:id')
  @UseInterceptors(MongooseClassSerializerInterceptor(HotelRoomDTO))
  async getHotelRoom(@Param('id') id: ID) {
    return await this.hotelRoomService.findById(id);
  }

  @Post('admin/hotels')
  @UseInterceptors(MongooseClassSerializerInterceptor(HotelDTO))
  async createHotel(@Body() data: CreateHotelParams) {
    return await this.hotelService.create(data);
  }

  @Get('admin/hotels')
  @UseInterceptors(MongooseClassSerializerInterceptor(HotelDTO))
  async getHotels(@Query() query: GetHotelsQueryParams) {
    return await this.hotelService.search(query);
  }

  @Put('admin/hotels/:id')
  @UseInterceptors(MongooseClassSerializerInterceptor(HotelDTO))
  async updateHotel(@Param('id') id: ID, @Body() data: UpdateHotelParams) {
    return await this.hotelService.update(id, data);
  }

  @Post('admin/hotel-rooms')
  @UseInterceptors(FilesInterceptor('images', 10))
  @UseInterceptors(MongooseClassSerializerInterceptor(HotelRoomDTO))
  async createHotelRoom(
    @Body() data: CreateHotelRoomParams,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return await this.hotelRoomService.create({ ...data, images });
  }

  @Put('admin/hotel-rooms/:id')
  @UseInterceptors(FilesInterceptor('images', 10))
  @UseInterceptors(MongooseClassSerializerInterceptor(HotelRoomDTO))
  async updateHotelRoom(
    @Param('id') roomId: ID,
    @Body() data: UpdateHotelRoomParams,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const images = [
      ...data.images,
      ...(files
        ? files.map((image) => image.path.replace(PUBLIC_DIR, ''))
        : []),
    ];

    return await this.hotelRoomService.update(roomId, { ...data, images });
  }
}
