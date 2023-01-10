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
  status,
} from '../index';
import { Descriptor } from './utils/descriptor.utils';
import { Group } from '../../groups/entities/group.entity';
import { GroupSubscriptors } from './helpers/groupSubscriptors.helper';
import { UserSubscriptions } from './helpers/userSubscriptions.helper';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist';
import { scheduler } from './helpers/scheduler-details.helpers';

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
  //#region Write Operations
  public async newSuscription(
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto> {
    const suscriptionResult = await this.suscriptionRepo.newSuscription(
      payload,
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
  //#region  //* Read Operation
  // Get subscriptions and nested details o subscriptions by uid
  public getSubscriptionsInfo? = async (
    filter = '',
    subStatus = status.ACTIVE,
    group: Group = null,
  ): Promise<Record<string, unknown>[]> => {
    const subscriptions = await this.suscriptionRepo.getSubscriptions(
      filter,
      subStatus,
    );
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
      groups,
      (id: string) => this.Iuser.getUserbyId(id),
    );
    return userSubscriptions.getSubscriptions();
  };
  // **get Active subscriptors from a group
  public async getGroupSubscriptions(
    groupId: string,
    status: status.ACTIVE,
  ): Promise<Record<string, unknown>[]> {
    const group = await this.Igroup.getById(groupId);
    const subscriptions = (
      await Promise.all(
        group.users.map(async (u) => {
          if (u != group.author) {
            return await this.getSubscriptionsInfo(u, status, group);
          }
        }),
      )
    )
      .flat()
      .filter((sub) => sub != null);
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
    const restDays = period.FormatedDates()['restDays'];
    const subscriptionDetails =
      await this.suscriptionRepo.getSubscriptionsDetail(period.periodId);
    subscriptionDetails.forEach(async (sub) => {
      try {
        const setStatus =
          scheduler[Number(restDays) < -3 ? '-3' : JSON.stringify(restDays)];
        sub.subscriptionStatus = setStatus;
        await this.suscriptionRepo.modifySubscriptions(sub);
      } catch (error) {
        //TODO: Inadmisible no controlar cualquier excepcion
        console.error(error);
      }
    });
  }
  //#endregion
}
