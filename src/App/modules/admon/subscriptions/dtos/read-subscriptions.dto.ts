import { Documents, DocumentData } from '../../../../Database/index';
import { subscriptionState } from '../subscription.enum';

export class SubscriptionDto {
  private subscriptionId: string;
  private userId: string;
  private createdDate: number;
  private createdBy: string;
  private modifiedBy: string;
  private subscriptionDetailId: Array<SubscriptionDetailDto>;
  private subscriptionDetail: Array<SubscriptionDetailDto>;
  constructor(plainObject: DocumentData) {
    this.subscriptionId = plainObject['subscriptionId'];
    this.userId = plainObject['userId'];
    this.createdDate = plainObject['createdDate'];
    this.createdBy = plainObject['createdBy'];
    this.modifiedBy = plainObject['modifiedBy'];
    this.subscriptionDetailId = plainObject['subscriptionDetailId'];
    this.subscriptionDetail = SubscriptionDetailDto.getDetailFromSnapshots(
      plainObject['details'],
    );
  }
  public static getSuscriptionsFromSnapshots = (
    snapshot: Documents,
  ): Array<SubscriptionDto> =>
    snapshot.map((snap) => new SubscriptionDto(snap));
}

export class SubscriptionDetailDto {
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
  ): Array<SubscriptionDetailDto> =>
    snapshot.map((snap) => new SubscriptionDetailDto(snap));
}
