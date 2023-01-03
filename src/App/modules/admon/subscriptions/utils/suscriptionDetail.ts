export class Detail {
  constructor(
    public suscriptionDetailId: string,
    public amount: number,
    public startDate: string,
    public endDate: string,
    public periodId: string,
    public periodName: string,
  ) {}
}