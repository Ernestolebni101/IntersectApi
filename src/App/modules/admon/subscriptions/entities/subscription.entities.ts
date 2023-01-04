import { Documents, DocumentData } from '../../../../Database/index';
import { subscriptionState } from '../subscription.enum';

export class Subscription {
  private subscriptionId: string;
  private userId: string;
  private createdDate: number;
  private createdBy: string;
  private modifiedBy: string;
  private subscriptionDetailId: Array<string>;
  private subscriptionDetail: Array<SubscriptionDetail>;
  constructor(plainObject: DocumentData) {
    this.subscriptionId = plainObject['subscriptionId'];
    this.userId = plainObject['userId'];
    this.createdDate = plainObject['createdDate'];
    this.createdBy = plainObject['createdBy'];
    this.modifiedBy = plainObject['modifiedBy'];
    this.subscriptionDetailId = plainObject['subscriptionDetailId'];
    this.subscriptionDetail = SubscriptionDetail.getDetailFromSnapshots(
      plainObject['details'],
    );
  }
  public static getSuscriptionsFromSnapshots = (
    snapshot: Documents,
  ): Array<Subscription> => snapshot.map((snap) => new Subscription(snap));
}

export class SubscriptionDetail {
  private subscriptioDetailId: string;
  private groupId: string;
  private paymentMethodId: string;
  private voucherUrl: string;
  private description: string;
  private amount: number;
  private beginDate: Date;
  private endDate: Date;
  private subscriptionState: subscriptionState;
  constructor(plainObject: DocumentData) {
    this.subscriptioDetailId = plainObject['subscriptionDetailId'];
    this.groupId = plainObject['groupId'];
    this.paymentMethodId = plainObject['paymentMethodId'];
    this.voucherUrl = plainObject['voucherUrl'];
    this.description = plainObject['description'];
    this.amount = plainObject['amount'];
    this.beginDate = plainObject['beginDate'];
    this.endDate = plainObject['endDate'];
    this.subscriptionState = plainObject['subscriptionState'];
  }
  public static getDetailFromSnapshots = (
    snapshot: Documents,
  ): Array<SubscriptionDetail> =>
    snapshot.map((snap) => new SubscriptionDetail(snap));
}
