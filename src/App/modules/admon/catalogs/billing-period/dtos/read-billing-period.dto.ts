import { ICatalog, IReadable } from '../../../index';
import { Documents } from '../../../../../Database/index';
import { Exclude, plainToInstance } from 'class-transformer';
import { Time } from '../../../../../../Utility/utility-time-zone';
export class BillingPeriodDto implements IReadable {
  constructor(
    public periodId: string,
    public periodName: string,
    public startDate: number,
    public endDate: number,
    public isActive: boolean,
    public duration: Record<string, string>,
  ) {
    duration = this.FormatedDates();
  }
  public FormatedDates = (): Record<string, string> => ({
    startDate: Time.getCustomDate(new Date(this.startDate), 'long'),
    endDate: Time.getCustomDate(new Date(this.endDate), 'long'),
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
