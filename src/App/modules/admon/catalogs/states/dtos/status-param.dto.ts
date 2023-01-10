import { ICatalog, status } from '../../../index';
export class StateParamDto implements ICatalog {
  constructor(public statusCode: status, public isActive: boolean) {}
  public reflectData = (): unknown => this;
}
