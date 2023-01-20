import {
  Body,
  Controller,
  Get,
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
import { updateDetialDto } from '../subscriptions/dtos/update-subscription.dto';
@Controller('admon/v1/')
export class AdmonController {
  constructor(private readonly suscriptionService: SubscriptionService) {}
  // @hasRoles(roles.ADMIN, roles.SA)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Post('new-subscription')
  // public async newSubscription(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body(SubscriptionPipe) payload: createSubscriptionDto,
  // ) {
  //   payload.createdBy = req.user['id'];
  //   await this.suscriptionService.newSuscription(payload);
  //   return success(req, res, 'login success', 201);
  // }
  // // @hasRoles(roles.ADMIN, roles.SA)
  // // @UseGuards(JwtAuthGuard, RolesGuard)
  // // @Post('users-search')
  // // public async userSearch(
  // //   @Req() req: Request,
  // //   @Res() res: Response,
  // //   @Body(SearchPipe) search: string,
  // // ) {
  // //   const response = (await this.userService.userSearch(search)).filter(
  // //     (user) => user.uid != req.user['id'],
  // //   );
  // //   return success(req, res, response, 200);
  // // }
  // //TODO: Middleware de Seguridad
  // @Get('user-subscription/:filter')
  // public async userSubscriptions(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param('filter') filter: string,
  // ) {
  //   const response = await this.suscriptionService.getSubscriptionsInfo(filter);
  //   return success(req, res, response, 200);
  // }
  // //TODO: Middleware de Seguridad
  // @Get('group-subscriptors/:groupId')
  // public async groupSubscriptors(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param('groupId') groupId: string,
  //   @Param('status') subStatus = status.ACTIVE,
  // ) {
  //   const response = await this.suscriptionService.getGroupSubscriptions(
  //     groupId,
  //     Number(subStatus),
  //   );
  //   return success(req, res, response, 200);
  // }
  // @Put('freemium-join')
  // public async freeJoin(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() payload: updateDetialDto,
  // ) {
  //   return this.suscriptionService
  //     .updateSubscriptionDetail(payload)
  //     .then((data) => success(req, res, data, 200))
  //     .catch((e) => error(req, res, 'Unexpected Error', e));
  // }
}
