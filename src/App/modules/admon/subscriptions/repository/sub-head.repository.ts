import {
  ISubscription,
} from 'src/App/shared/utils/query.interface';
import {status} from '../../catalogs/states/entities/create-state.entities';
import {
  Subscription,
  SubscriptionDetail,
} from '../entities/subscription.entities';
import { firestoreDb, FirestoreCollection } from '../../../../Database/index';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { createSubscriptionDto } from '../dtos/create-subscription.dto';
import { BadRequestException } from '@nestjs/common';
//#region detail
export class SubHeadRepository implements ISubscription {
  private readonly suscriptionCol: FirestoreCollection;
  private readonly subscriptionDetailCol: FirestoreCollection;
  constructor(private readonly fireDb: firestoreDb) {
    this.suscriptionCol = this.fireDb.collection('Suscriptions');
    this.subscriptionDetailCol = this.fireDb.collection('SuscriptionDetails');
  }
  public async getSubscriptionDetail?(id: string): Promise<SubscriptionDetail> {
    const subscription = await this.subscriptionDetailCol.doc(id).get();
    return subscription.exists
      ? new SubscriptionDetail(subscription.data())
      : null;
  }
  //#region //* Write Operations
  //TODO: Verificar si el acumulativo de suscripciones es valido para el uso requerido
  public newSuscription = async (
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto> => {
    const tran = await this.fireDb.runTransaction(async (tran) => {
      try {
        const { subscriptionDetail, ...head } = payload;
        const subscriptionRef = this.suscriptionCol.doc(payload.subscriptionId);
        tran.set(subscriptionRef, instanceToPlain(head));
        subscriptionDetail.forEach(async (detail) => {
          const detailRef = this.subscriptionDetailCol.doc(
            detail.subscriptionDetailId,
          );
          tran.set(detailRef, instanceToPlain(detail));
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    });
    if (!tran) throw new BadRequestException();
    return payload;
  };
  //#endregion
  //#region  Read Operations
  public async getAllSuscriptions?(): Promise<Subscription[]> {
    const docs = (await this.suscriptionCol.get()).docs;
    const snapshots = await Promise.all(
      docs.map(async (sub) => ({
        ...sub.data(),
        details: await Promise.all(
          (
            await this.subscriptionDetailCol
              .where('subscriptionId', '==', sub.data().subscriptionI)
              .get()
          ).docs,
        ),
      })),
    );
    return Subscription.getSuscriptionsFromSnapshots(snapshots);
  }
  //** get subscriptions and nested detail transactions objects passing de userId and the status of the subscription */
  public async getSubscriptions?(
    filter: string,
    state: status,
  ): Promise<Subscription[]> {
    const docs = (await this.suscriptionCol.where('userId', '==', filter).get())
      .docs;
    if (docs == null || docs == undefined) return null;
    const snapshots = (
      await Promise.all(
        docs.map(async (sub) => ({
          ...sub.data(),
          details: await Promise.all(
            (
              await this.subscriptionDetailCol
                .where('subscriptionId', '==', sub.data().subscriptionId)
                .where('subscriptionStatus', '==', state)
                .get()
            ).docs,
          ),
        })),
      )
    ).filter((snap) => snap.details.length != 0);
    return snapshots.length != 0
      ? Subscription.getSuscriptionsFromSnapshots(snapshots)
      : null;
  }
  /** //*Get details of a transactions inside the subscriptions */
  public async getSubscriptionsDetail(
    propertyName: string,
    Identifier: string,
  ): Promise<SubscriptionDetail[]> {
    const subscriptions = await this.subscriptionDetailCol
      .where(propertyName, '==', Identifier)
      .get();
    return (
      SubscriptionDetail.getDetailFromSnapshots(subscriptions.docs) ?? null
    );
  }
  //#endregion
}
//#endregion
