import { IReadable } from 'src/App/modules/admon';

export interface IAbstractRepository<TReadable extends IReadable> {
  getById<TParam extends IParam>(payload: TParam): Promise<TReadable>;
  getByParam<TParam extends IParam>(payload: TParam): Promise<TReadable[]>;
  getAll<TParam extends IParam>(payload: TParam): Promise<TReadable[]>;
  modifyData<TParam extends IParam>(payload: TParam): Promise<void>;
  createNew<TParam extends IParam>(payload: TParam): Promise<TReadable>;
}

export interface IParam {
  reflectData(): unknown;
}
