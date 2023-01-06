import {
  createSubscriptionDto,
  Detail,
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
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions';

export interface ISubscription {
  newSuscription(
    payload: createSubscriptionDto,
    period: Record<string, any>,
  ): Promise<createSubscriptionDto>;
  getAllSuscriptions?(): Promise<Subscription[]>;
  getSubscriptions?(filter: string): Promise<Subscription[]>;
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
  public newSuscription = async (
    payload: createSubscriptionDto,
    period: Record<string, unknown>,
  ): Promise<createSubscriptionDto> => {
    const tran = await this.fireDb.runTransaction(async (tran) => {
      try {
        const { subscriptionDetail, ...head } = payload;
        const suscriptionRef = this.suscriptionCol.doc(payload.subscriptionId);
        const detailGroups: Detail[] = [];
        const groupRefs: DocumentReference[] = [];
        tran.set(suscriptionRef, instanceToPlain(head));
        subscriptionDetail.forEach(async (detail, idx, arr) => {
          const suscriptionRef = this.subscriptionDetailCol.doc(
            detail.subscriptionDetailId,
          );
          groupRefs.push(this.groupCol.doc(detail.groupId));
          detailGroups.push(
            new Detail(
              detail.subscriptionDetailId,
              200,
              period['startDate'] as number,
              period['endDate'] as number,
              period['periodId'] as string,
              period['periodName'] as string,
            ),
          );
          tran.set(suscriptionRef, instanceToPlain(detail));
          if (idx == arr.length - 1)
            this.createDetail(detailGroups, groupRefs, tran);
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
  private createDetail(
    detail: Detail[],
    reference: DocumentReference[],
    tran: FirebaseFirestore.Transaction,
  ): void {
    detail.forEach((det, idx) => {
      tran.set(
        reference[idx],
        { billingData: [instanceToPlain(det)] },
        { merge: true },
      );
    });
  }

  public async getAllSuscriptions?(): Promise<Subscription[]> {
    const docs = (await this.suscriptionCol.get()).docs;
    const snapshots = await Promise.all(
      docs.map(async (sub) => ({
        ...sub.data(),
        details: await Promise.all(
          (
            await this.subscriptionDetailCol
              .where('subscriptionId', '==', sub.data().subscriptionId)
              .get()
          ).docs,
        ),
      })),
    );
    return Subscription.getSuscriptionsFromSnapshots(snapshots);
  }
  //TODO: rules for firebase transactions, subscriptions, groups to avoid duplicate data
  public async getSubscriptions?(filter: string): Promise<Subscription[]> {
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
              .get()
          ).docs,
        ),
      })),
    );
    return Subscription.getSuscriptionsFromSnapshots(snapshots);
  }
}
