import { ICatalog, IReadable } from '../../../index';
import { Documents } from '../../../../../Database/index';
import { Exclude, plainToInstance } from 'class-transformer';
import { Time } from '../../../../../../Utility/utility-time-zone';
export class BillingPeriodDto implements IReadable {
  public periodId: string;
  public periodName: string;
  public startDate: number;
  public endDate: number;
  public isActive: boolean;
  public duration: Record<string, string>;
  public FormatedDates = (): Record<string, unknown> => ({
    startDate: Time.getCustomDate(new Date(this.startDate), 'long'),
    endDate: Time.getCustomDate(new Date(this.endDate), 'long'),
    restDays: Time.daysBetween({
      startDate: new Date(),
      endDate: new Date(this.endDate),
    }),
  });
  public static getFromSnapshot = (docs: Documents): BillingPeriodDto[] =>
    docs.map((doc) => plainToInstance(BillingPeriodDto, doc.data()));
}

export class BillingIdentifierDto implements ICatalog {
  @Exclude()
  public reflectData = (): unknown => this;
  public periodId: string;
  public periodName: string;
  public isActive: string;
}
