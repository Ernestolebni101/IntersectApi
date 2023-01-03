import {
  FIRESTORE_DB,
  firestoreDb,
  FirestoreCollection,
} from '../../../../../Database/index';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ICatalog, ICatalogRepository } from '../../catalog.interface';
import {
  BillingIdentifierDto,
  BillingPeriodDto,
} from '../dtos/read-billing-period.dto';
import { createBillingPeriodDto } from '../dtos/billing-period.dto';

@Injectable({ scope: Scope.REQUEST })
export class BillingPeriodRepository
  implements ICatalogRepository<BillingPeriodDto>
{
  private readonly catalogCol: FirestoreCollection;
  constructor(@Inject(FIRESTORE_DB) private readonly fireDb: firestoreDb) {
    this.catalogCol = this.fireDb.collection('BillingPeriod');
  }
  public async newCatalogElement<TSet extends ICatalog>(
    payload: TSet,
  ): Promise<BillingPeriodDto> {
    const value = payload.reflectData() as createBillingPeriodDto;
    delete value.reflectData;
    const result = await this.catalogCol
      .doc(value.periodId)
      .set(instanceToPlain(value), { merge: true });
    if (!result) throw new InternalServerErrorException();
    return plainToInstance(BillingPeriodDto, value);
  }
  public async getByParam<TSet extends ICatalog>(
    payload: TSet,
  ): Promise<BillingPeriodDto[]> {
    const param = payload.reflectData() as BillingIdentifierDto;
    const docs = (
      await this.catalogCol.where('isActive', '==', param.isActive).get()
    ).docs;
    return BillingPeriodDto.getFromSnapshot(docs);
  }
  public async getAll(): Promise<BillingPeriodDto[]> {
    const foundDocs = (await this.catalogCol.get()).docs;
    return BillingPeriodDto.getFromSnapshot(foundDocs);
  }
}
