import { Module } from '@nestjs/common';
import { DownloadController } from "./download.controller";
import { DownloadService } from "./download.service";

@Module({
  providers: [DownloadService],
  exports: [DownloadService],
  controllers: [DownloadController],
})
export class DownloadModule {}
