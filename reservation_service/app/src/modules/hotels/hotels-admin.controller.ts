import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from "src/enums/user-role.enum";
import { ID } from "src/types/ID";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateHotelDto } from "./dto/create-hotel.dto";
import { UpdateHotelParamsDto } from "./dto/update-hotel-params.dto";
import { HotelsFormatter } from "./hotels.formatter";
import { HotelsService } from "./hotels.service";
import { SearchHotelParams } from "./interfaces/search-hotel-params.interface";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/admin/hotels')
export class HotelsAdminController {
  constructor(
    private hotelsService: HotelsService,
    private hotelsFormatter: HotelsFormatter,
  ) {}

  @Roles(UserRoleEnum.admin)
  @Post('/')
  async addHotel(@Body(DtoValidationPipe) createHotelDto: CreateHotelDto) {
    return this.hotelsFormatter.format(await this.hotelsService.create(createHotelDto));
  }

  @Roles(UserRoleEnum.admin)
  @Get('/')
  async hotelsList(@Query() query: SearchHotelParams) {
    const hotels = await this.hotelsService.search(query);
    return hotels.map(hotel => this.hotelsFormatter.format(hotel));
  }

  @Roles(UserRoleEnum.admin)
  @Put('/:id')
  async updateHotel(@Param('id') id: ID, @Body(DtoValidationPipe) dto: UpdateHotelParamsDto) {
    return this.hotelsFormatter.format(await this.hotelsService.update(id, dto));
  }
}
