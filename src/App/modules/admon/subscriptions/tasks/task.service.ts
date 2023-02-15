import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { plainToInstance } from 'class-transformer';
import { UnitOfWorkAdapter } from 'src/App/Database';
import { IAbstractRepository } from 'src/App/shared/utils/query.interface';
import {
  BillingIdentifierDto,
  BillingPeriodDto,
} from '../../catalogs/billing-period/dtos/read-billing-period.dto';
import { ICatalogRepository } from '../../catalogs/catalog.interface';
import { SubscriptionDetail } from '../dtos/read-subscriptions.dto';
import { getDetail } from '../dtos/create-subscription.dto';
import { scheduler } from '../helpers/scheduler-details.helpers';
@Injectable()
export class TaskService {
  private readonly Iperiod: ICatalogRepository<BillingPeriodDto>;
  private readonly Idetail: IAbstractRepository<SubscriptionDetail>;
  constructor(private readonly unitOfWork: UnitOfWorkAdapter) {
    this.Iperiod = this.unitOfWork.Repositories.billingRepo;
    this.Idetail = this.unitOfWork.Repositories.subDetailRepo;
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'deactivateSubscription',
    timeZone: 'America/Managua',
  })
  public async subscriptionScheduler() {
    const period = await this.Iperiod.getByParam(
      plainToInstance(BillingIdentifierDto, { isActive: true }),
    );
    const restDays = period.FormatedDates()['restDays'];
    const subscriptionDetails = await this.Idetail.getByParam(
      plainToInstance(getDetail, {
        fieldName: 'billingPeriodId',
        value: period.periodId,
      }),
    );
    subscriptionDetails.forEach(async (sub) => {
      try {
        const setStatus =
          scheduler[Number(restDays) < -3 ? '-3' : JSON.stringify(restDays)];
        sub.subscriptionStatus = setStatus;
        await this.Idetail.modifyData(plainToInstance(SubscriptionDetail, sub));
      } catch (error) {
        //         //TODO: Inadmisible no controlar cualquier excepcion
        console.error(error);
      }
    });
  }
}
