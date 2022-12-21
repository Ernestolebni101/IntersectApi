import {
  Body,
  Controller,
  Get,
  Post,
  Request as Req,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { BillingPeriodRepository, createBillingPeriodDto } from '../index';
import { Response, Request } from 'express';
import { success } from 'src/common/response';
import { roles, hasRoles, RolesGuard, JwtAuthGuard } from '../../auth/index';
import { CatalogPipe } from '../pipes/catalog.pipe';
@Controller('catalogs/v1/')
export class CatalogController {
  constructor(private readonly billingRepository: BillingPeriodRepository) {}
  //#region  Periods
  //   @hasRoles(roles.ADMIN, roles.SA)
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('billing-period')
  public async NewPeriod(
    @Req() req: Request,
    @Res() res: Response,
    @Body(CatalogPipe) payload: createBillingPeriodDto,
  ) {
    const response = await this.billingRepository.newCatalogElement(payload);
    return success(req, res, response, 201);
  }
  @Get('billing-period')
  public async getAllCatalogs(@Req() req: Request, @Res() res: Response) {
    const catalogs = await this.billingRepository.getAll();
    return success(req, res, catalogs, 200);
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
