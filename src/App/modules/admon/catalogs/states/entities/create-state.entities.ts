import { ICatalog } from '../../..';

export class createStateDto implements ICatalog {
  reflectData = (): unknown => this;
  constructor(
    public statusCode: status,
    public name: string,
    public description: string,
    public isActive: boolean,
    public createdDate: number,
    public modifiedDate: number,
  ) {}
}
export enum status {
  ACTIVE = 0,
  TOEXPIRE = 1,
  EXPIRED = 2,
}
