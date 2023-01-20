import {
  IAbstractRepository,
  IParam,
} from 'src/App/shared/utils/query.interface';
import { SubscriptionDetail } from '../dtos/read-subscriptions.dto';
import { firestoreDb, FirestoreCollection } from '../../../../Database/index';
import {
  createSubscriptionDetailDto,
  getDetail,
} from '../dtos/create-subscription.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
export class SubscriptionDetailRepository
  implements IAbstractRepository<SubscriptionDetail>
{
  private readonly collection: FirestoreCollection;
  constructor(private fireDb: firestoreDb) {
    this.collection = this.fireDb.collection('SuscriptionDetails');
  }
  public async getByParam<TParam extends IParam>(
    payload: TParam,
  ): Promise<SubscriptionDetail[]> {
    const param = payload.reflectData() as getDetail;
    let query = this.collection.where(param.fieldName, '==', param.value);
    if (param.status) query = query.where('status', '==', param.status);
    const foundDocs = await query.get();
    if (foundDocs.empty) return null;
    return foundDocs.docs.map((doc) =>
      plainToInstance(SubscriptionDetail, doc.data()),
    );
  }
  public async getById<TParam extends IParam>(
    payload: TParam,
  ): Promise<SubscriptionDetail> {
    const param = payload.reflectData() as getDetail;
    const foundDetail = await this.collection.doc(param.docId).get();
    return foundDetail.exists
      ? plainToInstance(SubscriptionDetail, foundDetail.data())
      : null;
  }
  public async getAll<TParam extends IParam>(
    payload: TParam,
  ): Promise<SubscriptionDetail[]> {
    throw new Error('Method not implemented.');
  }
  public async modifyData<TParam extends IParam>(
    payload: TParam,
  ): Promise<void> {
    try {
      const data = payload.reflectData() as SubscriptionDetail;
      await this.collection
        .doc(data.subscriptioDetailId)
        .update(instanceToPlain(data));
    } catch (error) {
      console.error(error);
    }
  }
  public async createNew<TParam extends IParam>(
    payload: TParam,
  ): Promise<SubscriptionDetail> {
    const data = payload.reflectData() as createSubscriptionDetailDto;
    delete data.rawContent;
    const tranResult = await this.fireDb.runTransaction(async (tran) => {
      try {
        const docRef = this.collection.doc(data.subscriptionDetailId);
        const period = (
          await tran.get(
            this.fireDb.collection('BillingPeriod').doc(data.billingPeriodId),
          )
        ).data();
        if (period.isActive) tran.set(docRef, instanceToPlain(data));
        return plainToInstance(SubscriptionDetail, data);
      } catch (error) {
        //TODO: LOGS
      }
    });
    return tranResult;
  }
}
