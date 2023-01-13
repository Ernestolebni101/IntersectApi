import { Documents, DocumentData } from '../../../../Database/index';
import { subscriptionType } from '../../catalogs/states/entities/create-state.entities';
import { status } from '../../index';
export class Subscription {
  public subscriptionId: string;
  public userId: string;
  public createdDate: number;
  public createdBy: string;
  public subscriptionDetail: Array<SubscriptionDetail>;
  constructor(plainObject: Record<string, unknown>) {
    this.subscriptionId = plainObject['subscriptionId'] as string;
    this.userId = plainObject['userId'] as string;
    this.createdDate = plainObject['createdDate'] as number;
    this.createdBy = plainObject['createdBy'] as string;
    this.subscriptionDetail = SubscriptionDetail.getDetailFromSnapshots(
      plainObject['details'] as Documents,
    );
  }
  public static getSuscriptionsFromSnapshots = (
    snapshot: Array<Record<string, unknown>>,
  ): Array<Subscription> => snapshot.map((snap) => new Subscription(snap));
}

export class SubscriptionDetail {
  public subscriptionId: string;
  public subscriptioDetailId: string;
  public groupId: string;
  public paymentMethodId: string;
  public voucherUrl: string;
  public description: string;
  public amount: number;
  public billingPeriodId: string;
  public subscriptionStatus: status;
  public subscriptionType: subscriptionType;
  public applyBeneficiary: boolean;
  public beneficiaryId?: string;
  constructor(plainObject: DocumentData) {
    this.subscriptionId = plainObject['subscriptionId'];
    this.subscriptioDetailId = plainObject['subscriptionDetailId'];
    this.groupId = plainObject['groupId'];
    this.paymentMethodId = plainObject['paymentMethodId'];
    this.voucherUrl = plainObject['voucherUrl'];
    this.description = plainObject['description'];
    this.amount = plainObject['amount'];
    this.billingPeriodId = plainObject['billingPeriodId'];
    this.subscriptionType = plainObject['subscriptionType'];
    this.applyBeneficiary = plainObject['applyBeneficiary'];
    this.applyBeneficiary = plainObject['applyBeneficiary'];
    this.beneficiaryId = plainObject['beneficiaryId'] ?? null;
  }
  public static getDetailFromSnapshots = (
    snapshot: Documents,
  ): Array<SubscriptionDetail> =>
    snapshot.map((snap) => new SubscriptionDetail(snap.data()));
}
