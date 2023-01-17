import { IParam } from 'src/App/shared/utils/query.interface';
import {
  status,
  subscriptionType,
} from '../../catalogs/states/entities/create-state.entities';
export class createSubscriptionDto {
  constructor(
    public subscriptionId: string, //automatico
    public userId: string, // entrada
    public createdDate: number, // automaticamente
    public createdBy: string, // automaticamente
    public modifiedBy: string, // automatico
    public detailReferences: Array<string>,
    public subscriptionDetail: Array<createSubscriptionDetailDto>,
  ) {}
}

export class createSubscriptionDetailDto implements IParam {
  constructor(
    public subscriptionId: string,
    public subscriptionDetailId: string,
    public groupId: string,
    public paymentMethodId: string,
    public voucherUrl: string,
    public description: string,
    public amount: number,
    public billingPeriodId: string,
    public subscriptionStatus: status,
    public subscriptionType: subscriptionType,
    public rawContent: Record<string, unknown>,
    public applyBeneficiary: boolean,
    public beneficiaryId?: string,
  ) {}
  public reflectData = (): unknown => this;
}

export class getDetail implements IParam {
  public docId?: string;
  public value?: string;
  public fieldName?: string;
  public status: status;
  public reflectData = (): unknown => this;
}
