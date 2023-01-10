import { status } from '../..';

export class SubscriptionDto {
  public subscriptionId: string;
  public userId: string;
  public createdDate: number;
  public createdBy: string;
  public modifiedBy: string;
  public subscriptionDetail: Array<SubscriptionDetailDto>;
}

export class SubscriptionDetailDto {
  public subscriptioDetailId: string;
  public groupId: string;
  public paymentMethodId: string;
  public voucherUrl: string;
  public description: string;
  public amount: number;
  public beginDate: Date;
  public endDate: Date;
  public subscriptionStatus: status;
}
