import { NestInterceptor, Type } from '@nestjs/common';
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import config from "src/config";

const defaultConfig = diskStorage({
  destination: `./${config.imagesUploadPath}`,
  filename: (req: any, file, cb) => {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
  }
})

export function ImagesFilesInterceptor(): Type<NestInterceptor> {
  return FilesInterceptor('images', config.maxFilesCount, { storage: defaultConfig });
}
