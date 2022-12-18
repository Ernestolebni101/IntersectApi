import {
  Body,
  Controller,
  Get,
  Inject,
  NotImplementedException,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { success } from 'src/common/response';
import * as Exp from 'express';
import { SuscriptionRepository } from './suscriptions/repository/suscription.repository';
import { createSuscriptionDto } from './suscriptions/dtos/create-suscription.dto';
@Controller('admon/v1/')
export class AdmonController {
  constructor(private readonly suscriptionRepository: SuscriptionRepository) {}

  @Post('suscription')
  public async identity(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payload: createSuscriptionDto,
  ) {
    await this.suscriptionRepository.newSuscription(payload);
    return success(req, res, 'QE', 200);
  }
}
