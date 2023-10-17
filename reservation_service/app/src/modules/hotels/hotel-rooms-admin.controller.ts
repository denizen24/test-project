import { Body, Controller, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserRoleEnum } from "src/enums/user-role.enum";
import { ImagesFilesInterceptor } from "src/interceptors/images.files.interceptor";
import { HotelRoom } from "src/modules/hotels/mongo.schemas/hotel-room.schema";
import { ID } from "src/types/ID";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { ImagesValidationPipe } from "src/validators/images.validation.pipe";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateHotelRoomDto } from "./dto/create-hotel-room.dto";
import { UpdateHotelRoomDto } from "./dto/update-hotel-room.dto";
import { HotelsRoomFormatter } from "./hotels-room.formatter";
import { HotelsRoomService } from "./hotels-room.service";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/admin/hotel-rooms')
export class HotelRoomsAdminController {
  constructor(
    private hotelsRoomService: HotelsRoomService,
    private hotelsRoomFormatter: HotelsRoomFormatter,
  ) {}

  @Roles(UserRoleEnum.admin)
  @Post('/')
  @UseInterceptors(ImagesFilesInterceptor())
  async addHotelRoom(
    @Body(DtoValidationPipe) createHotelRoomDto: CreateHotelRoomDto,
    @UploadedFiles(ImagesValidationPipe()) images: Array<Express.Multer.File>
  ) {
    const params: Partial<HotelRoom> = Object.assign({}, createHotelRoomDto, {
      images: images.map(image => image.filename),
    });
    return this.hotelsRoomFormatter.format(await this.hotelsRoomService.create(params));
  }

  @Roles(UserRoleEnum.admin)
  @Put('/:id')
  @UseInterceptors(ImagesFilesInterceptor())
  async updateHotelRoom(
    @Param('id') id: ID,
    @Body(DtoValidationPipe) updateHotelRoomDto: UpdateHotelRoomDto,
    @UploadedFiles(ImagesValidationPipe()) images: Array<Express.Multer.File>
  ) {
    const params: Partial<HotelRoom> = Object.assign({}, updateHotelRoomDto, {
      images: images.map(image => image.filename),
    });
    if (updateHotelRoomDto.images?.length) {
      params.images.push(...updateHotelRoomDto.images);
    }
    return this.hotelsRoomFormatter.format(await this.hotelsRoomService.update(id, params));
  }
}
