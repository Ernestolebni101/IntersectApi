import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { createSubscriptionDto } from '../subscriptions/dtos/create-subscription.dto';
@Injectable()
export class SubscriptionPipe implements PipeTransform {
  transform(value: createSubscriptionDto, metadata: ArgumentMetadata) {
    value.subscriptionId = this.setId(value.userId);
    value.createdDate = new Date().getTime();
    value.detailReferences = value.subscriptionDetail.map((detail) => {
      detail.amount = 200;
      detail.subscriptionId = value.subscriptionId;
      return (detail.subscriptionDetailId = uuid());
    });
    return value;
  }
  private setId(uid: string): string {
    const truncatedUid = uuid().split('-', 4)[0];
    return `Premium-${truncatedUid.concat(uid)}`;
  }
}
