import {
  firestoreDb,
  FirestoreCollection,
} from '../../../../../Database/index';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ICatalog, ICatalogRepository } from '../../catalog.interface';
import {
  BillingIdentifierDto,
  BillingPeriodDto,
} from '../dtos/read-billing-period.dto';
import { createBillingPeriodDto } from '../dtos/billing-period.dto';
export class BillingPeriodRepository
  implements ICatalogRepository<BillingPeriodDto>
{
  private readonly catalogCol: FirestoreCollection;
  constructor(private fireDb: firestoreDb) {
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
  ): Promise<BillingPeriodDto> {
    const param = payload.reflectData() as BillingIdentifierDto;
    const doc = (
      await this.catalogCol.where('isActive', '==', param.isActive).get()
    ).docs[0];
    return plainToInstance(BillingPeriodDto, doc.data());
  }
  public async getAll(): Promise<BillingPeriodDto[]> {
    const foundDocs = (await this.catalogCol.get()).docs;
    return BillingPeriodDto.getFromSnapshot(foundDocs);
  }
}
