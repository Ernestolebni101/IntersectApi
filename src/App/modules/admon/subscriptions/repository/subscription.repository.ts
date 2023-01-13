import {
  createSubscriptionDto,
  status,
  Subscription,
  SubscriptionDetail,
} from '../../index';
import {
  FIRESTORE_DB,
  firestoreDb,
  FirestoreCollection,
} from '../../../../Database/index';
import { Inject, Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions';
export interface ISubscription {
  newSuscription(
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto>;
  modifySubscriptions(
    subscriptions: SubscriptionDetail,
    callback?: () => Promise<void>,
  ): Promise<void>;
  getAllSuscriptions?(): Promise<Subscription[]>;
  getSubscriptions?(filter: string, status: status): Promise<Subscription[]>;
  getSubscriptionsDetail?(
    billingPeriodId: string,
  ): Promise<SubscriptionDetail[]>;
  getSubscriptionDetail?(id: string): Promise<SubscriptionDetail>;
}
@Injectable()
export class SubscriptionRepository implements ISubscription {
  private readonly suscriptionCol: FirestoreCollection;
  private readonly subscriptionDetailCol: FirestoreCollection;
  constructor(@Inject(FIRESTORE_DB) private readonly fireDb: firestoreDb) {
    this.suscriptionCol = this.fireDb.collection('Suscriptions');
    this.subscriptionDetailCol = this.fireDb.collection('SuscriptionDetails');
  }
  public async getSubscriptionDetail?(id: string): Promise<SubscriptionDetail> {
    const subscription = await this.subscriptionDetailCol.doc(id).get();
    return subscription.exists ? new SubscriptionDetail(subscription) : null;
  }
  //#region //* Write Operations
  //TODO: Verificar si el acumulativo de suscripciones es valido para el uso requerido
  public newSuscription = async (
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto> => {
    const tran = await this.fireDb.runTransaction(async (tran) => {
      try {
        const { subscriptionDetail, ...head } = payload;
        const suscriptionRef = this.suscriptionCol.doc(payload.subscriptionId);
        tran.set(suscriptionRef, instanceToPlain(head));
        subscriptionDetail.forEach(async (detail) => {
          const suscriptionRef = this.subscriptionDetailCol.doc(
            detail.subscriptionDetailId,
          );
          tran.set(suscriptionRef, instanceToPlain(detail));
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
  /** //* Modify fields of a subscription */
  public async modifySubscriptions(
    subscriptions: SubscriptionDetail,
    callback?: () => Promise<void>,
  ): Promise<void> {
    try {
      const writeResult = await this.subscriptionDetailCol
        .doc(subscriptions.subscriptioDetailId)
        .update(instanceToPlain(subscriptions));
      console.log(writeResult.writeTime);
    } catch (error) {
      console.error(error);
    }
  }
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
    status: status,
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
                .where('subscriptionStatus', '==', status)
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
    billingPeriodId: string,
  ): Promise<SubscriptionDetail[]> {
    const subscriptions = await this.subscriptionDetailCol
      .where('billingPeriodId', '==', billingPeriodId)
      .get();
    return (
      SubscriptionDetail.getDetailFromSnapshots(subscriptions.docs) ?? null
    );
  }
  //#endregion
}
