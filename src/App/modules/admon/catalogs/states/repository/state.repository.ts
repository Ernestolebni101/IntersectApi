import {
  ICatalog,
  ICatalogRepository,
  State,
  StateParamDto,
} from '../../../index';
import {
  firestoreDb,
  DocumentData,
  DocumentReference,
  FirestoreCollection,
} from '../../../../../Database/index';
import { plainToInstance } from 'class-transformer';
export class StateCatalogRepository implements ICatalogRepository<State> {
  private catalogCol: FirestoreCollection;
  constructor(private readonly db: firestoreDb) {
    this.catalogCol = this.db.collection('Status');
  }
  public async getByParam?<TSet extends ICatalog>(
    payload: TSet,
  ): Promise<State> {
    const param = payload.reflectData() as StateParamDto;
    const snapshot = (
      await this.catalogCol
        .where('status', '==', param.statusCode)
        .where('isActive', '==', param.isActive)
        .get()
    ).docs[0];
    if (!snapshot.exists) return null;
    return plainToInstance(State, snapshot);
  }
  public async newCatalogElement<TSet extends ICatalog>(
    payload: TSet,
  ): Promise<State> {
    throw new Error('Method not implemented.');
  }

  public async getAll(): Promise<State[]> {
    throw new Error('Method not implemented.');
  }
}
