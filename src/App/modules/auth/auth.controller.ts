import {
  Controller,
  Get,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './guards/local.auth.guard';
@Controller('auth/v1/')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('identity')
  identity(@Req() req: Request, @Res() res: Response): any {
    return res.status(201).send('Logged in!');
  }
  @Get('protected')
  getCookies(@Req() req: Request) {
    return req.user;
  }
}
