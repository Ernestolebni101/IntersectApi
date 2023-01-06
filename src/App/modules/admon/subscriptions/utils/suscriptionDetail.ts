export class Detail {
  constructor(
    public suscriptionDetailId: string,
    public amount: number,
    public startDate: number,
    public endDate: number,
    public periodId: string,
    public periodName: string,
  ) {}
}
