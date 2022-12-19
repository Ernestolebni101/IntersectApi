import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { createSuscriptionDto } from '../suscriptions/dtos/create-suscription.dto';
import { v4 as uuid } from 'uuid';
@Injectable()
export class SuscriptionPipe implements PipeTransform {
  transform(value: createSuscriptionDto, metadata: ArgumentMetadata) {
    value.suscriptionId = this.setId(value.userId);
    value.detailReferences = value.suscriptionDetail.map(
      (detail) => (detail.suscriptioDetailId = uuid()),
    );
    return value;
  }
  private setId(uid: string): string {
    const truncatedUid = uuid().split('-', 4)[0];
    return `Premium-${truncatedUid.concat(uid)}`;
  }
}
