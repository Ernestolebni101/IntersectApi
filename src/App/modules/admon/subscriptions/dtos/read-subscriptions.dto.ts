import { IReadable, status } from '../..';

export class Subscription implements IReadable {
  public subscriptionId: string;
  public userId: string;
  public createdDate: number;
  public createdBy: string;
  public modifiedBy: string;
  public Details: SubscriptionDetail[];
}

export class SubscriptionDetail implements IReadable {
  public subscriptionId: string;
  public subscriptioDetailId: string;
  public groupId: string;
  public paymentMethodId: string;
  public voucherUrl: string;
  public description: string;
  public amount: number;
  public billingPeriodId: string;
  public subscriptionStatus: status;
  public applyBeneficiary: boolean;
  public beneficiaryId?: string;
}
