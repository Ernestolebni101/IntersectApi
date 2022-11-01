export class UpsertSettingsDto {
  constructor(
    public groupId: string,
    public id: string,
    public user: string,
    public isNotify?: boolean,
  ) {}
}
