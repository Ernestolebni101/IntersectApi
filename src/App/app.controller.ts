import { Controller, Get, Response, Request } from '@nestjs/common';
import { AppService } from './app.service';
import * as Exp from 'express';
import { success, error } from '../common/response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async DefaultMessage(
    @Request() req,
    @Response() res,
  ): Promise<Exp.Response<string>> {
    const message = await this.appService.getMessage();
    return new Promise((resolve, reject) => {
      resolve(success(req, res, message, 200));
    });
  }
}
