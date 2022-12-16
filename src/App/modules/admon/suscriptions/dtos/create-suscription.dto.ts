import { suscriptionState } from '../suscription.enum';

export class createSuscriptionDto {
  constructor(
    public suscriptionId: string,
    public userId: string,
    public createdDate: Date,
    public createdBy: string,
    public modifiedBy: string,
    public suscriptionDetailId: createSuscriptionDetailDto,
  ) {}
}

export class createSuscriptionDetailDto {
  constructor(
    public suscriptioDetailId: string,
    public groupId: string,
    public paymentMethodId: string,
    public voucherUrl: string,
    public description: string,
    public amount: number,
    public beginDate: Date,
    public endDate: Date,
    public suscriptionState: suscriptionState,
  ) {}
}
