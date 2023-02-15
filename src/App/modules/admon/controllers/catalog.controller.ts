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
import { createBillingPeriodDto } from '../index';
import { Response, Request } from 'express';
import { success } from 'src/common/response';
import { roles, hasRoles, RolesGuard, JwtAuthGuard } from '../../auth/index';
import { CatalogPipe } from '../pipes/catalog.pipe';
import { UnitOfWorkAdapter } from '../../../Database/UnitOfWork/adapter.implements';
@Controller('catalogs/v1/')
export class CatalogController {
  constructor(private readonly unitOfwork: UnitOfWorkAdapter) {}
  //#region  Periods
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('billing-period')
  public async NewPeriod(
    @Req() req: Request,
    @Res() res: Response,
    @Body(CatalogPipe) payload: createBillingPeriodDto,
  ) {
    const response =
      await this.unitOfwork.Repositories.billingRepo.newCatalogElement(payload);
    return success(req, res, response, 201);
  }
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('billing-period')
  public async getAllCatalogs(
    @Req() req: Request,
    @Res() res: Response,
    @Param('isActive') isActive = true,
  ) {
    const catalogs = await this.unitOfwork.Repositories.billingRepo.getAll();
    return success(
      req,
      res,
      catalogs.filter((c) => c.isActive == isActive),
      200,
    );
  }
  //#endregion
  //#region States
  @hasRoles(roles.ADMIN, roles.SA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('states')
  public async NewState(@Req() req: Request, @Res() res: Response) {
    return success(req, res, 'success', 201);
  }
  //#endregion
}
