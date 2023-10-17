import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import config from "src/config";
import { DownloadService } from "./download.service";

@Controller()
export class DownloadController {

  constructor(private readonly downloadService: DownloadService) {}

  @Get(`/${config.imagesUploadPath}/:id`)
  images(@Param('id') id: string, @Res() response: Response) {
    const file = this.downloadService.buffer(id);
    response.send(file);
  }
}
