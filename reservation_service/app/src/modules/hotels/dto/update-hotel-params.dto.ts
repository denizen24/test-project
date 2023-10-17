import { IsString } from "class-validator";

export class UpdateHotelParamsDto implements UpdateHotelParams {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
