import { createSuscriptionDto } from '../dtos/create-suscription.dto';
import {
  SuscriptionDetailDto,
  SuscriptionDto,
} from '../dtos/read-suscriptions.dto';
import {
  FIRESTORE_DB,
  firestoreDb,
  FirestoreCollection,
} from '../../../../Database/index';
import { Inject, Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions';
import { BillingPeriodDto } from '../..';
import { BillingIdentifierDto } from '../../catalogs/billing-period/dtos/read-billing-period.dto';

export interface ISuscription {
  newSuscription(
    payload: createSuscriptionDto,
    fnp: (payload: BillingIdentifierDto) => Promise<BillingPeriodDto[]>,
  ): Promise<createSuscriptionDto>;
  getSuscriptions(): Promise<Array<SuscriptionDto>>;
  getSuscriptionDetail(): Promise<Array<SuscriptionDetailDto>>;
}
@Injectable()
export class SuscriptionRepository implements ISuscription {
  private readonly suscriptionCol: FirestoreCollection;
  private readonly sucriptionDetailCol: FirestoreCollection;
  private readonly groupCol: FirestoreCollection;
  constructor(@Inject(FIRESTORE_DB) private readonly fireDb: firestoreDb) {
    this.suscriptionCol = this.fireDb.collection('Suscriptions');
    this.sucriptionDetailCol = this.fireDb.collection('SuscriptionDetails');
    this.groupCol = this.fireDb.collection('interGroups');
  }
  public newSuscription = async (
    payload: createSuscriptionDto,
    fnp: (payload: BillingIdentifierDto) => Promise<BillingPeriodDto[]>,
  ): Promise<createSuscriptionDto> => {
    const tran = await this.fireDb.runTransaction(async (tran) => {
      try {
        const { suscriptionDetail, ...head } = payload;
        const period = (
          await fnp(plainToInstance(BillingIdentifierDto, { isActive: true }))
        )[0];
        const suscriptionRef = this.suscriptionCol.doc(payload.suscriptionId);
        tran.set(suscriptionRef, instanceToPlain(head));
        suscriptionDetail.forEach(async (detail) => {
          const ref = this.sucriptionDetailCol.doc(detail.suscriptioDetailId);
          tran.set(ref, instanceToPlain(detail));
          await this.groupCol.doc(detail.groupId).set(
            {
              billingRecords: [
                { amount: 200, billPeriod: instanceToPlain(period) },
              ],
            },
            { merge: true },
          );
        });
        return true;
      } catch (error) {
        return false;
      }
    });
    if (!tran) throw new BadRequestException();
    return payload;
  };
  public async getSuscriptions(): Promise<Array<SuscriptionDto>> {
    throw new Error('Method not implemented.');
  }
  public async getSuscriptionDetail(): Promise<Array<SuscriptionDetailDto>> {
    throw new Error('Method not implemented.');
  }
}
