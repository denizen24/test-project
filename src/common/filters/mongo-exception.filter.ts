import { MongoError } from 'mongodb';

import { ArgumentsHost, ExceptionFilter, Catch } from '@nestjs/common';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.status(400).json({
      statusCode: 400,
      createdBy: 'MongoExceptionFilter',
      errors: exception,
    });
  }
}
