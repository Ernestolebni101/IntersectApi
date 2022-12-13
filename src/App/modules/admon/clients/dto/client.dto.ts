export class createClientDto {
  constructor(
    public clientId: string,
    public uid: string,
    public customerRecords: Record<string, unknown>,
  ) {}
}
