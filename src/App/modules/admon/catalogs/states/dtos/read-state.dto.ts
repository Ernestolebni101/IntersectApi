import { IReadable } from '../../catalog.interface';

export class StateDto extends IReadable {
  public stateCode: string;
  public name: string;
  public description: string;
  public isActive: string;
  public createdDate: number;
  public modifiedDate: number;
}
