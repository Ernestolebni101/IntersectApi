import {
  Controller,
  Get,
  Inject,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { success } from 'src/common/response';
import * as Exp from 'express';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { hasRoles } from './helpers/roles.decorator';
import { roles } from './helpers/role.enum';
@Controller('auth/v1/')
export class AuthController {
  constructor(@Inject('AUTH') private readonly authService: AuthService) {}
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(RolesGuard)
  @Post('identity')
  public async identity(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Exp.Response<AuthResponse>> {
    const response = await this.authService.logCredentials(req.body);
    return success(req, res, response);
  }
  @hasRoles(roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('protected')
  getCookies(@Req() req: Request) {
    return req.user;
  }
}
