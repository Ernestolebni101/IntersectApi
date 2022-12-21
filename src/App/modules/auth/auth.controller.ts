import {
  Controller,
  Get,
  Inject,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
  Session,
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
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local.auth.guard';
@Controller('auth/v1/')
export class AuthController {
  constructor(@Inject('AUTH') private readonly authService: AuthService) {}
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(AuthGuard('local'), RolesGuard)
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

  @UseGuards(LocalAuthGuard)
  @Post('session')
  public session(@Req() req: Request, @Res() res: Response) {}

  @Get('session')
  public getSession(@Session() session: Record<string, unknown>) {
    session['authenticated'] = true;
    return session;
  }
}
