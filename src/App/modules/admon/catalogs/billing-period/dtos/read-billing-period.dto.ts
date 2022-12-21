import { ICatalog, IReadable } from '../../../index';
import { Documents } from '../../../../../Database/index';
import { Exclude, plainToInstance } from 'class-transformer';
export class BillingPeriodDto implements IReadable {
  public periodId: string;
  public periodName: string;
  public isActive: boolean;
  @Exclude()
  public static getFromSnapshot = (docs: Documents): BillingPeriodDto[] =>
    docs.map((doc) => plainToInstance(BillingPeriodDto, doc.data()));
}

export class BillingIdentifierDto implements ICatalog {
  public reflectData = (): unknown => this;
  public periodId: string;
  public periodName: string;
  public isActive: string;
}
