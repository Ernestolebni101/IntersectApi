import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Time } from 'src/Utility/utility-time-zone';
import { v4 as uuid } from 'uuid';
import { createBillingPeriodDto } from '../catalogs/billing-period/dtos/billing-period.dto';
@Injectable()
export class CatalogPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.periodId = `periodo-${uuid().split('-')[0]}`;
    value.isActive = true;
    return new createBillingPeriodDto(
      value.periodId,
      value.periodName,
      true,
      value.endDate || Time.getNextMonth(),
    );
  }
}
