import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UnitOfWorkAdapter } from 'src/App/Database';
import * as FILES from 'src/Utility/utility-createFile';
import { v4 as uuid } from 'uuid';
import { status } from '..';
import { IUserRepository } from '../../users';
import { subscriptionType } from '../catalogs/states/entities/create-state.entities';
import { createSubscriptionDto } from '../subscriptions/dtos/create-subscription.dto';
@Injectable()
export class SubscriptionPipe implements PipeTransform {
  private readonly Iuser: IUserRepository;
  constructor(private readonly unitOfWork: UnitOfWorkAdapter) {
    this.Iuser = this.unitOfWork.Repositories.userRepository;
  }
  async transform(value: createSubscriptionDto, metadata: ArgumentMetadata) {
    const joinHistory = (await this.Iuser.getUserbyId(value.userId))
      .joinHistory;
    value.subscriptionId = this.setId(value.userId);
    value.createdDate = new Date().getTime();
    value.detailReferences = value.subscriptionDetail.map((detail) => {
      detail.amount = 200;
      detail.subscriptionId = value.subscriptionId;
      detail.subscriptionStatus = status.ACTIVE;
      detail.rawContent = FILES.File.base64ToImage(detail.voucherUrl);
      detail.subscriptionType = subscriptionType.PREM;
      detail.applyBeneficiary = !joinHistory.includes(detail.groupId);
      return (detail.subscriptionDetailId = uuid());
    });
    return value;
  }
  private setId(uid: string): string {
    const truncatedUid = uuid().split('-', 4)[0];
    return `Premium-${truncatedUid.concat(uid)}`;
  }
}
