import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class GenerateHashService {

  isValid(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  generate(password) {
    if (!password) {
      throw new Error("Пароль не может быть пустым");
    }
    return bcrypt.hashSync(password, saltRounds);
  }
}
