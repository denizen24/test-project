import { IsDefined, IsString } from "class-validator";
import { ID } from "src/types/ID";
import { CreateSupportRequest } from "../interfaces/create-support-request.interface";

export class CreateSupportRequestDto implements CreateSupportRequest {
  @IsDefined() @IsString()
  text: string;

  userId: ID;
}
