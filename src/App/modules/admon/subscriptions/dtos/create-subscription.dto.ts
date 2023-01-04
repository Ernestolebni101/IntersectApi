import { subscriptionState } from '../subscription.enum';
export class createSubscriptionDto {
  constructor(
    public subscriptionId: string, //automatico
    public userId: string, // entrada
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
    public suscriptionState: subscriptionState, // por defecto
    public amount: number,
    public billingPeriodId: string,
  ) {}
}
