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
import { v4 as uuid } from 'uuid';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
export interface ISuscription {
  newSuscription(payload: createSuscriptionDto): Promise<void>;
  getSuscriptions(): Promise<Array<SuscriptionDto>>;
  getSuscriptionDetail(): Promise<Array<SuscriptionDetailDto>>;
}
@Injectable()
export class SuscriptionRepository implements ISuscription {
  private readonly suscriptionCol: FirestoreCollection;
  private readonly sucriptionDetailCol: FirestoreCollection;
  constructor(@Inject(FIRESTORE_DB) private readonly fireDb: firestoreDb) {
    this.suscriptionCol = this.fireDb.collection('Suscriptions');
    this.sucriptionDetailCol = this.fireDb.collection('SuscriptionDetails');
  }
  public async newSuscription(payload: createSuscriptionDto): Promise<void> {
    await this.fireDb.runTransaction(async (tran) => {
      const { suscriptionDetail, ...head } = payload;
      const suscriptionRef = this.suscriptionCol.doc(payload.suscriptionId);
      tran.set(suscriptionRef, instanceToPlain(head));
      suscriptionDetail.forEach((detail) => {
        const ref = this.sucriptionDetailCol.doc(detail.suscriptioDetailId);
        tran.set(ref, instanceToPlain(detail));
      });
    });
  }
  public async getSuscriptions(): Promise<Array<SuscriptionDto>> {
    throw new Error('Method not implemented.');
  }
  public async getSuscriptionDetail(): Promise<Array<SuscriptionDetailDto>> {
    throw new Error('Method not implemented.');
  }
}
