import { HttpStatus, ParseFilePipe, ParseFilePipeBuilder } from '@nestjs/common';
import { MaxSizeFileValidator } from "src/validators/max-size-file.validator";
import config from "src/config";

export function ImagesValidationPipe(): ParseFilePipe {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /(jpg|jpeg|png|gif)$/,
    })
    .addValidator(
      new MaxSizeFileValidator({
        maxSize: config.maxUploadSize
      }),
    )
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
}
