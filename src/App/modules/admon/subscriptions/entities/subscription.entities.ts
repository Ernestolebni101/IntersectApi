import { Documents, DocumentData } from '../../../../Database/index';
import { subscriptionState } from '../subscription.enum';

export class Subscription {
  private subscriptionId: string;
  private userId: string;
  private createdDate: string;
  private createdBy: string;
  private subscriptionDetail: Array<SubscriptionDetail>;
  constructor(plainObject: Record<string, unknown>) {
    this.subscriptionId = plainObject['subscriptionId'] as string;
    this.userId = plainObject['userId'] as string;
    this.createdDate = plainObject['createdDate'] as string;
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
  private subscriptionId: string;
  private subscriptioDetailId: string;
  private groupId: string;
  private paymentMethodId: string;
  private voucherUrl: string;
  private description: string;
  private amount: number;
  private beginDate: Date;
  private endDate: Date;
  // TODO private subscriptionState: subscriptionState;
  constructor(plainObject: DocumentData) {
    this.subscriptionId = plainObject['subscriptionId'];
    this.subscriptioDetailId = plainObject['subscriptionDetailId'];
    this.groupId = plainObject['groupId'];
    this.paymentMethodId = plainObject['paymentMethodId'];
    this.voucherUrl = plainObject['voucherUrl'];
    this.description = plainObject['description'];
    this.amount = plainObject['amount'];
    this.beginDate = plainObject['beginDate'];
    this.endDate = plainObject['endDate'];
  }
  public static getDetailFromSnapshots = (
    snapshot: Documents,
  ): Array<SubscriptionDetail> =>
    snapshot.map((snap) => new SubscriptionDetail(snap.data()));
}
