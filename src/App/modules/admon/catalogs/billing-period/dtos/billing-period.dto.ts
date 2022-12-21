import { ICatalog } from '../../catalog.interface';

export class createBillingPeriodDto implements ICatalog {
  constructor(
    public periodId: string,
    public periodName: string,
    public isActive: boolean,
    public endDate: Date,
  ) {}
  public reflectData = (): unknown => this;
}

export class updateBillingPeriod extends createBillingPeriodDto {}
