export class SuscriptionManagement {
  public suscriptionManagementId: string;
  public suscriptionId: string;
  public beginDate: Date;
  public endDate: Date;
  public suscriptionState: number;
}

export class SuscriptionStatus {
  public statusCode: number;
  public mean: string;
  public description: string;
  public createdDate: Date;
}
