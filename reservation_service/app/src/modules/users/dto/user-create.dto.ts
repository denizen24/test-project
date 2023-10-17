import { IsDefined, IsEmail, IsIn, IsString, Length } from "class-validator";
import { UserRoleEnum } from "src/enums/user-role.enum";

export class CreateUserDto {
  @IsDefined() @IsString() @IsEmail()
  email: string;

  @IsDefined() @IsString() @Length(10)
  password: string;

  @IsDefined() @IsString() @Length(3)
  name: string;

  @IsString()
  contactPhone: string;

  @IsString() @IsIn([UserRoleEnum.client, UserRoleEnum.admin, UserRoleEnum.manager])
  role: string;
}
