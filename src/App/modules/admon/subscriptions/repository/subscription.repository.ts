import { createSubscriptionDto } from '../dtos/create-subscription.dto';
import {
  SubscriptionDetailDto,
  SubscriptionDto,
} from '../dtos/read-subscriptions.dto';
import {
  FIRESTORE_DB,
  firestoreDb,
  FirestoreCollection,
  DocumentReference,
} from '../../../../Database/index';
import { Inject, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions';
import { BillingPeriodDto } from '../..';
import { Detail } from '../utils/suscriptionDetail';

export interface ISubscription {
  newSuscription(
    payload: createSubscriptionDto,
    period: Record<string, any>,
  ): Promise<createSubscriptionDto>;
  getSuscriptions(): Promise<Array<SubscriptionDto>>;
  getSuscriptionDetail(): Promise<Array<SubscriptionDetailDto>>;
}
@Injectable()
export class SubscriptionRepository implements ISubscription {
  private readonly suscriptionCol: FirestoreCollection;
  private readonly sucriptionDetailCol: FirestoreCollection;
  private readonly groupCol: FirestoreCollection;
  constructor(@Inject(FIRESTORE_DB) private readonly fireDb: firestoreDb) {
    this.suscriptionCol = this.fireDb.collection('Suscriptions');
    this.sucriptionDetailCol = this.fireDb.collection('SuscriptionDetails');
    this.groupCol = this.fireDb.collection('interGroups');
  }
  public newSuscription = async (
    payload: createSubscriptionDto,
    period: Record<string, unknown>,
  ): Promise<createSubscriptionDto> => {
    const tran = await this.fireDb.runTransaction(async (tran) => {
      try {
        const { subscriptionDetail, ...head } = payload;
        const suscriptionRef = this.suscriptionCol.doc(payload.suscriptionId);
        const detailGroups: Detail[] = [];
        const groupRefs: DocumentReference[] = [];
        tran.set(suscriptionRef, instanceToPlain(head));
        subscriptionDetail.forEach(async (detail, idx, arr) => {
          const suscriptionRef = this.sucriptionDetailCol.doc(
            detail.subscriptionDetailId,
          );
          groupRefs.push(this.groupCol.doc(detail.groupId));
          detailGroups.push(
            new Detail(
              detail.subscriptionDetailId,
              200,
              period['startDate'] as string,
              period['endDate'] as string,
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

  public async getSuscriptions(): Promise<Array<SubscriptionDto>> {
    throw new Error('Method not implemented.');
  }
  public async getSuscriptionDetail(): Promise<Array<SubscriptionDetailDto>> {
    throw new Error('Method not implemented.');
  }
}
