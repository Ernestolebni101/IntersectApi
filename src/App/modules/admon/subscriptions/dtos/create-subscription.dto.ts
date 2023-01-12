import {
  status,
  subscriptionType,
} from '../../catalogs/states/entities/create-state.entities';
export class createSubscriptionDto {
  constructor(
    public subscriptionId: string, //automatico
    public userId: string, // entrada
    public beneficiarys: Beneficiary[],
    public createdDate: number, // automaticamente
    public createdBy: string, // automaticamente
    public modifiedBy: string, // automatico
    public detailReferences: Array<string>,
    public subscriptionDetail: Array<createSubscriptionDetailDto>,
  ) {}
}

export class createSubscriptionDetailDto {
  constructor(
    public subscriptionId: string,
    public subscriptionDetailId: string,
    public groupId: string,
    public paymentMethodId: string,
    public voucherUrl: string,
    public description: string,
    public amount: number,
    public billingPeriodId: string,
    public subscriptionStatus: status,
    public subscriptionType: subscriptionType,
    public rawContent: Record<string, unknown>,
    public applyBeneficiary: boolean,
  ) {}
}

export class Beneficiary {
  constructor(public userId: string, public groupId: string) {}
}
