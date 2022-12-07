export class Suscription {
  public suscriptionCode: string;
  public suscriptionDetail: Record<string, unknown> = {};
  public createdDate: Date;
  public modifiedBy: string;
  public description: string;
}
