import { Expose, Transform } from 'class-transformer';

export class BaseDTO {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  constructor(partial: Partial<BaseDTO>) {
    Object.assign(this, partial);
  }
}
