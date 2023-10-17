import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import config from "src/config";

@Injectable()
export class DownloadService {

    buffer(id: string) {
        return readFileSync(join(process.cwd(), config.imagesUploadPath, id));
    }
}
