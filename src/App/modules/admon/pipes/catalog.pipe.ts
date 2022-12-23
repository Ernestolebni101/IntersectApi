import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Time } from 'src/Utility/utility-time-zone';
import { v4 as uuid } from 'uuid';
import { createBillingPeriodDto } from '../catalogs/billing-period/dtos/billing-period.dto';
@Injectable()
export class CatalogPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.periodId = `periodo-${uuid().split('-')[0]}`;
    value.isActive = true;
    const beginDate: number = new Date().getTime();
    const endDate: number = Time.getNextMonth().getTime();
    return new createBillingPeriodDto(
      value.periodId,
      value.periodName,
      true,
      beginDate,
      endDate,
    );
  }
}
