import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { error, success } from 'src/common/response';
import { roles, hasRoles, RolesGuard, JwtAuthGuard } from '../../auth/index';
import { SearchPipe } from '../pipes/search.pipe';
import { createSubscriptionDto } from '../subscriptions/dtos/create-subscription.dto';
import { SubscriptionPipe } from '../pipes/subscription.pipe';
import { SubscriptionService } from '../subscriptions/subscriptions.service';
import { status } from '..';
import {
  updateDetialDto,
  updateSubscriptionDetailDto,
} from '../subscriptions/dtos/update-subscription.dto';
import { UsersService } from '../../users';
@Controller('admon/v1/')
export class AdmonController {
  constructor(
    private readonly suscriptionService: SubscriptionService,
    @Inject('USERS') private readonly userService: UsersService,
  ) {}
  //#region Read Operations
  //TODO: Middleware de Seguridad
  @Get('user-subscription/:filter')
  public async userSubscriptions(
    @Req() req: Request,
    @Res() res: Response,
    @Param('filter') filter: string,
  ) {
    const response = await this.suscriptionService.getSubscriptionsInfo(filter);
    return success(req, res, response, 200);
  }
  //TODO: Middleware de Seguridad
  @Get('group-subscriptors/:groupId')
  public async groupSubscriptors(
    @Req() req: Request,
    @Res() res: Response,
    @Param('groupId') groupId: string,
    @Param('status') subStatus = status.ACTIVE,
  ) {
    const response = await this.suscriptionService.getGroupSubscriptions(
      groupId,
      Number(subStatus),
    );
    return success(req, res, response, 200);
  }
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('new-subscription')
  public async newSubscription(
    @Req() req: Request,
    @Res() res: Response,
    @Body(SubscriptionPipe) payload: createSubscriptionDto,
  ) {
    payload.createdBy = req.user['id'];
    await this.suscriptionService.newSuscription(payload);
    return success(req, res, 'login success', 201);
  }
  //#endregion
  //#region
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('users-search')
  public async userSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Body(SearchPipe) search: string,
  ) {
    const response = await this.userService.userSearch(search);
    return success(
      req,
      res,
      response.filter((u) => u.uid != req.user['id']),
      200,
    );
  }
  // @hasRoles(roles.ADMIN, roles.SA)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('manage-subscription')
  public async manageSubscription(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payload: updateSubscriptionDetailDto,
  ) {
    return await this.suscriptionService
      .modifySubscription(payload)
      .then(() => success(req, res, '', 204))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }

  @Put('freemium-join')
  public async freeJoin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payload: updateDetialDto,
  ) {
    return this.suscriptionService
      .updateSubscriptionDetail(payload)
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }
  //#endregion
}
