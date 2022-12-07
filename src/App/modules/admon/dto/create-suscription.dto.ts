export class CreateSuscriptionDto {
  constructor(
    public suscriptionCode: string,
    public suscriptionDetail: CreateDetailDto,
    public createdDate: Date,
    public modifiedBy: string,
    public description: string,
  ) {}
}

export class CreateDetailDto {
  constructor(
    public suscriptionId: string,
    public suscriptionDetailId: string,
    public userUid: string,
    public groupId: string,
    public paymentMethod: string,
    public voucherUrl: string,
    public amount: number,
  ) {}
}
