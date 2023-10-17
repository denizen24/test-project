import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from "express";

@Catch(Error)
export class UnifiedExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    if (typeof (exception as HttpException).getStatus === "function") {
      status = (exception as HttpException).getStatus();
    }

    response
      .status(status)
      .json({
        timestamp: new Date().toISOString(),
        statusCode: status || 500,
        success: false,
        data: exception.message,
      });
  }
}
