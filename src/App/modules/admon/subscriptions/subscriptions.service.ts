import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UnitOfWorkAdapter } from 'src/App/Database';
import { UpdateGroupDto } from '../../groups/dto/update-group.dto';
import { IGroupsRepository } from '../../groups/repository/groups.repository';
import { IUserRepository } from '../../users/repository/user.repository';
import {
  SubscriptionRepository,
  createSubscriptionDto,
  BillingIdentifierDto,
  BillingPeriodRepository,
  ICatalog,
} from '../index';
import { Descriptor } from './utils/descriptor.utils';
import { Group } from '../../groups/entities/group.entity';
import { GroupSubscriptors } from './helpers/groupSubscriptors.helper';
import { UserSubscriptions } from './helpers/userSubscriptions.helper';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist';

@Injectable()
export class SubscriptionService {
  private readonly Igroup: IGroupsRepository;
  private readonly Iuser: IUserRepository;
  constructor(
    private readonly unitOfWork: UnitOfWorkAdapter,
    private readonly suscriptionRepo: SubscriptionRepository,
    private readonly periodRepo: BillingPeriodRepository,
    private readonly emmiter: EventEmitter2,
  ) {
    this.Igroup = this.unitOfWork.Repositories.groupsRepository;
    this.Iuser = this.unitOfWork.Repositories.userRepository;
  }
  //#region
  public async newSuscription(
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto> {
    const periods = await this.periodRepo.getByParam(
      plainToInstance(BillingIdentifierDto, { isActive: true }),
    );
    const suscriptionResult = await this.suscriptionRepo.newSuscription(
      payload,
      instanceToPlain(periods),
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
  //#endregion
  // Get subscriptions and nested details o subscriptions by uid
  public getSubscriptionsInfo? = async (
    filter = '',
    group: Group = null,
  ): Promise<Record<string, unknown>[]> => {
    const subscriptions = await this.suscriptionRepo.getSubscriptions(filter);
    if (subscriptions == null) return null;
    if (group != null) {
      const groupSubscriptors = new GroupSubscriptors(
        subscriptions,
        (payload: ICatalog) => this.periodRepo.getByParam(payload),
        (id: string) => this.Iuser.getUserbyId(id),
        { [group.id]: group },
      );
      return groupSubscriptors.getSubscriptors();
    }
    const groups = (await Descriptor.Distinct(
      subscriptions.flatMap((sub) => sub.subscriptionDetail),
      'groupId',
      this.Igroup.getById,
    )) as Record<string, Group>;
    const userSubscriptions = new UserSubscriptions(
      subscriptions,
      (payload: ICatalog) => this.periodRepo.getByParam(payload),
      (id: string) => this.Igroup.(id),
      groups,
    );
    return userSubscriptions.getSubscriptions();
  };
  // **get Active subscriptors from a group
  public async getGroupSubscriptions(
    groupId: string,
  ): Promise<Record<string, unknown>[]> {
    const group = await this.Igroup.getById(groupId);
    const subscriptions = (
      await Promise.all(
        group.users.map(async (u) => {
          if (u != group.author) {
            return await this.getSubscriptionsInfo(u, group);
          }
        }),
      )
    ).flat();
    return subscriptions;
  }
  //#region Cron Jobs
  //** deactivate subscriptions */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'deactivateSubscription',
    timeZone: 'America/Managua',
  })
  public async Scheduler() {
    const period = await this.periodRepo.getByParam(
      plainToInstance(BillingIdentifierDto, { isActive: true }),
    );
    const restDays = Number(period.FormatedDates()['restDays']);
    const subscriptions = await this.suscriptionRepo.getSubscriptionsDetail(
      period.periodId,
    );
    switch (restDays) {
      case 0:
        console.log('A punto de terminar');
        break;
      case -3:
        console.log('TERMINADA');
        break;
      default:
        console.log(`${restDays} SOBREPASO LA FECHA`);
        break;
    }
  }
  //#endregion
}
