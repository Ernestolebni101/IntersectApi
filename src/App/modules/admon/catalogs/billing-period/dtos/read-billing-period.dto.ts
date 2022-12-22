import { ICatalog, IReadable } from '../../../index';
import { Documents, firestoreTimestamp } from '../../../../../Database/index';
import { Exclude, plainToInstance } from 'class-transformer';
export class BillingPeriodDto implements IReadable {
  public periodId: string;
  public periodName: string;
  public startDate: firestoreTimestamp;
  public endDate: firestoreTimestamp;
  public isActive: boolean;
  public static getFromSnapshot = (docs: Documents): BillingPeriodDto[] =>
    docs.map((doc) => {
      console.log(doc.data());
      return plainToInstance(BillingPeriodDto, doc.data());
    });
}

export class BillingIdentifierDto implements ICatalog {
  @Exclude()
  public reflectData = (): unknown => this;
  public periodId: string;
  public periodName: string;
  public isActive: string;
}
