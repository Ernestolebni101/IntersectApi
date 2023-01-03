import { ICatalog, ICatalogRepository } from '../../catalog.interface';
import { StateDto } from '../dtos/read-state.dto';

export class StateCatalogRepository implements ICatalogRepository<StateDto> {
  public async newCatalogElement<TSet extends ICatalog>(
    payload: TSet,
  ): Promise<StateDto> {
    throw new Error('Method not implemented.');
  }
  public async getByParam<TSet extends ICatalog>(
    payload: TSet,
  ): Promise<StateDto[]> {
    throw new Error('Method not implemented.');
  }
  public async getAll(): Promise<StateDto[]> {
    throw new Error('Method not implemented.');
  }
}
