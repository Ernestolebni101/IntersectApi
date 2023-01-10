import {
  createSubscriptionDto,
  updateSubscriptionDetailDto,
  status,
  Subscription,
  SubscriptionDetail,
} from '../../index';
import {
  FIRESTORE_DB,
  firestoreDb,
  FirestoreCollection,
  DocumentReference,
} from '../../../../Database/index';
import { Inject, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions';

export interface ISubscription {
  newSuscription(
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto>;
  modifySubscriptions(subscriptions: SubscriptionDetail): Promise<void>;
  getAllSuscriptions?(): Promise<Subscription[]>;
  getSubscriptions?(filter: string, status: status): Promise<Subscription[]>;
  getSubscriptionsDetail?(
    billingPeriodId: string,
  ): Promise<SubscriptionDetail[]>;
}
@Injectable()
export class SubscriptionRepository implements ISubscription {
  private readonly suscriptionCol: FirestoreCollection;
  private readonly subscriptionDetailCol: FirestoreCollection;
  private readonly groupCol: FirestoreCollection;
  constructor(@Inject(FIRESTORE_DB) private readonly fireDb: firestoreDb) {
    this.suscriptionCol = this.fireDb.collection('Suscriptions');
    this.subscriptionDetailCol = this.fireDb.collection('SuscriptionDetails');
    this.groupCol = this.fireDb.collection('interGroups');
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
        const groupRefs: DocumentReference[] = [];
        tran.set(suscriptionRef, instanceToPlain(head));
        subscriptionDetail.forEach(async (detail) => {
          const suscriptionRef = this.subscriptionDetailCol.doc(
            detail.subscriptionDetailId,
          );
          groupRefs.push(this.groupCol.doc(detail.groupId));
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
  ): Promise<void> {
    try {
      const writeResult = await this.subscriptionDetailCol
        .doc(subscriptions.subscriptioDetailId)
        .update(instanceToPlain(subscriptions));
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
    const snapshots = await Promise.all(
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
    );
    return Subscription.getSuscriptionsFromSnapshots(snapshots);
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
