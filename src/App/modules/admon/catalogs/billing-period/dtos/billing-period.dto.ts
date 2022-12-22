import { ICatalog } from '../../catalog.interface';

export class createBillingPeriodDto implements ICatalog {
  constructor(
    public periodId: string,
    public periodName: string,
    public isActive: boolean,
    public startDate: FirebaseFirestore.Timestamp,
    public endDate: FirebaseFirestore.Timestamp,
  ) {}
  public reflectData = (): unknown => this;
}

export class updateBillingPeriod extends createBillingPeriodDto {}
