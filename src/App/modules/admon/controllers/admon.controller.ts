import {
  Body,
  Controller,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { success } from 'src/common/response';
import { roles, hasRoles, RolesGuard, JwtAuthGuard } from '../../auth/index';
import { createSuscriptionDto } from '../suscriptions/dtos/create-suscription.dto';
import { SuscriptionPipe } from '../pipes/suscription.pipe';
import { SearchPipe } from '../pipes/search.pipe';
import { UsersService } from '../../users/users.service';
import { SuscriptionService } from '../suscriptions/suscriptions.service';
@Controller('admon/v1/')
export class AdmonController {
  constructor(
    private readonly suscriptionService: SuscriptionService,
    private readonly userService: UsersService,
  ) {}
  // @hasRoles(roles.ADMIN, roles.SA)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('new-suscription')
  public async identity(
    @Req() req: Request,
    @Res() res: Response,
    @Body(SuscriptionPipe) payload: createSuscriptionDto,
  ) {
    await this.suscriptionService.newSuscription(payload);
    return success(req, res, 'login success', 201);
  }
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('users-search')
  public async userSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Body(SearchPipe) search: string,
  ) {
    const response = await this.userService.userSearch(search);
    return success(req, res, response, 200);
  }
}
