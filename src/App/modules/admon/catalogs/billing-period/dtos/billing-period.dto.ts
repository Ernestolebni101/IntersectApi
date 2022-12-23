import { ICatalog } from '../../catalog.interface';
export class createBillingPeriodDto implements ICatalog {
  constructor(
    public periodId: string,
    public periodName: string,
    public isActive: boolean,
    public startDate: number,
    public endDate: number,
  ) {}
  public reflectData = (): unknown => this;
}

export class updateBillingPeriod extends createBillingPeriodDto {}
