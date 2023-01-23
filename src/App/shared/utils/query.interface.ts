import {
  createSubscriptionDto,
  IReadable,
  Subscription,
  SubscriptionDetail,
} from 'src/App/modules/admon';

export interface IAbstractRepository<TReadable extends IReadable> {
  getById<TParam extends IParam>(payload: TParam): Promise<TReadable>;
  getByParam<TParam extends IParam>(payload: TParam): Promise<TReadable[]>;
  getAll<TParam extends IParam>(payload: TParam): Promise<TReadable[]>;
  modifyData<TParam extends IParam>(payload: TParam): Promise<void>;
  createNew<TParam extends IParam>(payload: TParam): Promise<TReadable>;
}

export interface ISubscription {
  newSuscription(
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto>;
  getAllSuscriptions?(): Promise<Subscription[]>;
  getSubscriptions?(filter: string, state: number): Promise<Subscription[]>;
  getSubscriptionsDetail?(
    propertyName: string,
    Identifier: string,
  ): Promise<SubscriptionDetail[]>;
  getSubscriptionDetail?(id: string): Promise<SubscriptionDetail>;
}

export interface IParam {
  reflectData(): unknown;
}
