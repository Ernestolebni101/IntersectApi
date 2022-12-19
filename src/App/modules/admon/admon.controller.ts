import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { success } from 'src/common/response';
import { roles, hasRoles, RolesGuard, JwtAuthGuard } from '../auth/index';
import { SuscriptionRepository } from './suscriptions/repository/suscription.repository';
import { createSuscriptionDto } from './suscriptions/dtos/create-suscription.dto';
import { SuscriptionPipe } from './pipes/suscription.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { UsersService } from '../users/users.service';
@Controller('admon/v1/')
export class AdmonController {
  constructor(
    private readonly suscriptionRepository: SuscriptionRepository,
    private readonly userService: UsersService,
  ) {}
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('suscription')
  public async identity(
    @Req() req: Request,
    @Res() res: Response,
    @Body(SuscriptionPipe) payload: createSuscriptionDto,
  ) {
    await this.suscriptionRepository.newSuscription(payload);
    return success(req, res, 'QE', 200);
  }
  // @hasRoles(roles.ADMIN, roles.SA)
  // @UseGuards(JwtAuthGuard, RolesGuard)
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
