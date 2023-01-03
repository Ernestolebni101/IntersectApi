/* eslint-disable @typescript-eslint/no-empty-interface */
export interface ICatalogRepository<TReadable extends IReadable> {
  newCatalogElement<TSet extends ICatalog>(payload: TSet): Promise<TReadable>;
  getByParam<TSet extends ICatalog>(payload: TSet): Promise<Array<TReadable>>;
  getAll(): Promise<Array<TReadable>>;
}

export interface ICatalog {
  reflectData(): unknown;
}

export abstract class IReadable {}
