import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { v4 as uuid } from 'uuid';
import { status } from '..';
import { createSubscriptionDto } from '../subscriptions/dtos/create-subscription.dto';
@Injectable()
export class SubscriptionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.subscriptionId = this.setId(value.userId);
    value.createdDate = new Date().getTime();
    value.subscriptionDetail = JSON.parse(value.subscriptionDetail);
    value.detailReferences = value.subscriptionDetail.map((detail) => {
      detail.amount = 200;
      detail.subscriptionId = value.subscriptionId;
      detail.subscriptionStatus = status.ACTIVE;
      return (detail.subscriptionDetailId = uuid());
    });
    return plainToInstance(createSubscriptionDto, value);
  }
  private setId(uid: string): string {
    const truncatedUid = uuid().split('-', 4)[0];
    return `Premium-${truncatedUid.concat(uid)}`;
  }
}
