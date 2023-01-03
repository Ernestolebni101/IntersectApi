import { ICatalog, IReadable } from '../../../index';
import { Documents } from '../../../../../Database/index';
import { Exclude, plainToInstance, Transform } from 'class-transformer';
import { Time } from '../../../../../../Utility/utility-time-zone';
export class BillingPeriodDto implements IReadable {
  public periodId: string;
  public periodName: string;
  @Transform((value) => Time.getCustomDate(new Date(value.value), 'long'), {
    toClassOnly: true,
  })
  @Transform((value) => value.value, { toPlainOnly: true })
  public startDate: number;
  @Transform((value) => Time.getCustomDate(new Date(value.value), 'long'), {
    toClassOnly: true,
  })
  @Transform((value) => value.value, { toPlainOnly: true })
  public endDate: number;
  public isActive: boolean;
  public static getFromSnapshot = (docs: Documents): BillingPeriodDto[] =>
    docs.map((doc) => plainToInstance(BillingPeriodDto, doc.data()));
  public static getFromPlain = (docs: Documents): BillingPeriodDto[] =>
    docs.map((doc) => plainToInstance(BillingPeriodDto, doc.data()));
}

export class BillingIdentifierDto implements ICatalog {
  @Exclude()
  public reflectData = (): unknown => this;
  public periodId: string;
  public periodName: string;
  public isActive: string;
}
