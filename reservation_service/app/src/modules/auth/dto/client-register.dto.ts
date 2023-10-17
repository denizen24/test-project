import { IsDefined, IsEmail, IsEmpty, IsString, Length } from "class-validator";

export class ClientRegisterDto {
  @IsDefined() @IsString() @IsEmail()
  email: string;

  @IsDefined() @IsString() @Length(10)
  password: string;

  @IsDefined() @IsString() @Length(3)
  name: string;

  @IsString()
  contactPhone: string;

  @IsEmpty()
  role: string;
}
