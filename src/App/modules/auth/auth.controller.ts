import {
  Body,
  Controller,
  Get,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { success } from 'src/common/response';
import { AuthService } from './auth.service';
import * as Exp from 'express';
import { createAuthDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/localauth.guard';
@Controller('auth/v1/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('identity')
  identity(@Req() req: Request): any {
    // const response = await this.authService.Identity(payload);
    return req.user;
  }
  @Get('protected')
  getCookies(@Req() req: Request) {
    return req.user;
  }
}
