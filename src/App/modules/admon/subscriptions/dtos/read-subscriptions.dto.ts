import { IReadable, status } from '../..';
import { subscriptionType } from '../../catalogs/states/entities/create-state.entities';

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
  public subscriptionType: subscriptionType;
}
