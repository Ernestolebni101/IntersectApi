import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { createBillingPeriodDto } from '../catalogs/billing-period/dtos/billing-period.dto';
import * as moment from 'moment';
@Injectable()
export class CatalogPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.periodId = `periodo-${uuid().split('-')[0]}`;
    value.isActive = true;
    const currentDate = moment();
    const beginDate: number = currentDate.startOf('month').valueOf();
    const endDate: number = currentDate
      .add(1, 'months')
      .endOf('month')
      .valueOf();
    return new createBillingPeriodDto(
      value.periodId,
      value.periodName,
      true,
      beginDate,
      endDate,
    );
  }
}
