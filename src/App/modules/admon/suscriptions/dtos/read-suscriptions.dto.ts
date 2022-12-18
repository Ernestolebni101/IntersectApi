import { Documents, DocumentData } from '../../../../Database/index';
import { suscriptionState } from '../suscription.enum';

export class SuscriptionDto {
  private suscriptionId: string;
  private userId: string;
  private createdDate: Date;
  private createdBy: string;
  private modifiedBy: string;
  private suscriptionDetailId: Array<SuscriptionDetailDto>;
  private suscriptionDetail: Array<SuscriptionDetailDto>;
  constructor(plainObject: DocumentData) {
    this.suscriptionId = plainObject['suscriptionId'];
    this.userId = plainObject['userId'];
    this.createdDate = plainObject['createdDate'];
    this.createdBy = plainObject['createdBy'];
    this.modifiedBy = plainObject['modifiedBy'];
    this.suscriptionDetailId = plainObject['suscriptionDetailId'];
    this.suscriptionDetail = SuscriptionDetailDto.getDetailFromSnapshots(
      plainObject['details'],
    );
  }
  public static getSuscriptionsFromSnapshots = (
    snapshot: Documents,
  ): Array<SuscriptionDto> => snapshot.map((snap) => new SuscriptionDto(snap));
}

export class SuscriptionDetailDto {
  private suscriptioDetailId: string;
  private groupId: string;
  private paymentMethodId: string;
  private voucherUrl: string;
  private description: string;
  private amount: number;
  private beginDate: Date;
  private endDate: Date;
  private suscriptionState: suscriptionState;
  constructor(plainObject: DocumentData) {
    this.suscriptioDetailId = plainObject['suscriptioDetailId'];
    this.groupId = plainObject['groupId'];
    this.paymentMethodId = plainObject['paymentMethodId'];
    this.voucherUrl = plainObject['vou`cherUrl'];
    this.description = plainObject['description'];
    this.amount = plainObject['amount'];
    this.beginDate = plainObject['beginDate'];
    this.endDate = plainObject['endDate'];
    this.suscriptionState = plainObject['suscriptionState'];
  }
  public static getDetailFromSnapshots = (
    snapshot: Documents,
  ): Array<SuscriptionDetailDto> =>
    snapshot.map((snap) => new SuscriptionDetailDto(snap));
}
