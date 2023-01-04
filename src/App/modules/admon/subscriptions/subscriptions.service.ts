import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UnitOfWorkAdapter } from 'src/App/Database';
import { UpdateGroupDto } from '../../groups/dto/update-group.dto';
import { IGroupsRepository } from '../../groups/repository/groups.repository';
import {
  SubscriptionRepository,
  Subscription,
  createSubscriptionDto,
  BillingIdentifierDto,
  BillingPeriodRepository,
} from '../index';

@Injectable()
export class SubscriptionService {
  private readonly Igroup: IGroupsRepository;
  constructor(
    private readonly unitOfWork: UnitOfWorkAdapter,
    private readonly suscriptionRepo: SubscriptionRepository,
    private readonly periodRepo: BillingPeriodRepository,
    private readonly emmiter: EventEmitter2,
  ) {
    this.Igroup = this.unitOfWork.Repositories.groupsRepository;
  }
  public async newSuscription(
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto> {
    const periods = await this.periodRepo.getByParam(
      plainToInstance(BillingIdentifierDto, { isActive: true }),
    );
    const suscriptionResult = await this.suscriptionRepo.newSuscription(
      payload,
      instanceToPlain(periods[0]),
    );
    suscriptionResult.subscriptionDetail.forEach(async (detail) => {
      await this.Igroup.updateGroup(
        undefined,
        plainToInstance(UpdateGroupDto, {
          id: detail.groupId,
          userId: suscriptionResult.userId,
          memberOption: 0,
        }),
        undefined,
        this.emmiter,
      );
    });
    this.unitOfWork.commitChanges();
    return suscriptionResult;
  }
  public getUserSubscriptions = async (): Promise<Subscription[]> =>
    await this.suscriptionRepo.getAllSuscriptions();
}