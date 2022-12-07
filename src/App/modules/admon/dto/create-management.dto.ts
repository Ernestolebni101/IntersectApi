export class CreateManagementDto {
  constructor(
    public suscriptionManagementId: string,
    public suscriptionId: string,
    public beginDate: Date,
    public endDate: Date,
    public suscriptionState: number,
  ) {}
}
