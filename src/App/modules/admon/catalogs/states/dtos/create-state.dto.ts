import { ICatalog } from '../../..';

export class createStateDto implements ICatalog {
  reflectData = (): unknown => this;
  constructor(
    public stateCode: string,
    public name: string,
    public description: string,
    public isActive: string,
    public createdDate: number,
    public modifiedDate: number,
  ) {}
}
