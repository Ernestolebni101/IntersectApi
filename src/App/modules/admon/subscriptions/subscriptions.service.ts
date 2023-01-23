import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { File } from '../../../../Utility/utility-createFile';
import { plainToInstance } from 'class-transformer';
import { UnitOfWorkAdapter } from '../../../Database/UnitOfWork/adapter.implements';
import { MemberOpt, UpdateGroupDto } from '../../groups/dto/update-group.dto';
import { IGroupsRepository } from '../../groups/repository/groups.repository';
import { IUserRepository } from '../../users/repository/user.repository';
import {
  createSubscriptionDto,
  BillingIdentifierDto,
  ICatalog,
  status,
  ICatalogRepository,
  BillingPeriodDto,
  SubscriptionDetailRepository,
} from '../index';
import { Descriptor } from './utils/descriptor.utils';
import { Group } from '../../groups/entities/group.entity';
import { GroupSubscriptors } from './helpers/groupSubscriptors.helper';
import { UserSubscriptions } from './helpers/userSubscriptions.helper';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist';
import { scheduler } from './helpers/scheduler-details.helpers';
import { updateDetialDto } from './dtos/update-subscription.dto';
import {
  IAbstractRepository,
  ISubscription,
} from 'src/App/shared/utils/query.interface';
import { SubscriptionDetail } from './dtos/read-subscriptions.dto';

@Injectable()
export class SubscriptionService {
  private readonly Igroup: IGroupsRepository;
  private readonly Iuser: IUserRepository;
  private readonly Isub: ISubscription;
  private readonly Idetail: IAbstractRepository<SubscriptionDetailRepository>;
  private readonly Iperiod: ICatalogRepository<BillingPeriodDto>;
  constructor(
    private readonly unitOfWork: UnitOfWorkAdapter,
    private readonly emmiter: EventEmitter2,
  ) {
    this.Igroup = this.unitOfWork.Repositories.groupsRepository;
    this.Iuser = this.unitOfWork.Repositories.userRepository;
    this.Iperiod = this.unitOfWork.Repositories.billingRepo;
    this.Isub = this.unitOfWork.Repositories.subRepo;
  }
  //#region Write Opera tions
  public async newSuscription(
    payload: createSubscriptionDto,
  ): Promise<createSubscriptionDto> {
    payload.subscriptionDetail = await Promise.all(
      payload.subscriptionDetail.map(async (detail) => {
        detail.voucherUrl = await File.submitFile(
          detail.rawContent,
          await this.unitOfWork.getBucket(),
        );
        delete detail.rawContent;
        return detail;
      }),
    );
    const subscriptionResult = await this.Isub.newSuscription(payload);
    subscriptionResult.subscriptionDetail.forEach(async (detail) => {
      await this.Igroup.updateGroup(
        undefined,
        plainToInstance(UpdateGroupDto, {
          id: detail.groupId,
          userId: subscriptionResult.userId,
          memberOption: 0,
        }),
        undefined,
        this.emmiter,
      );
    });
    this.unitOfWork.commitChanges();
    return subscriptionResult;
  }
  public async updateSubscriptionDetail?(
    payload: updateDetialDto,
  ): Promise<Group> {
    const subscriptionDetail = await this.Isub.getSubscriptionDetail(
      payload.code,
    );
    if (subscriptionDetail == null || subscriptionDetail.beneficiaryId != null)
      throw new NotFoundException();
    subscriptionDetail.beneficiaryId = payload.userId;
    await this.Idetail.modifyData(
      plainToInstance(SubscriptionDetail, subscriptionDetail),
    );
    await this.Igroup.updateGroup(
      undefined,
      plainToInstance(UpdateGroupDto, {
        id: subscriptionDetail.groupId,
        userId: payload.userId,
        memberOption: MemberOpt.addMember,
      }),
      undefined,
      this.emmiter,
    );
    return await this.Igroup.getById(subscriptionDetail.groupId);
  }
  //#endregion

  //#region //* Read Operation
  // Get subscriptions and nested details o subscriptions by uid
  public getSubscriptionsInfo? = async (
    filter = '',
    subStatus = status.ACTIVE,
    group: Group = null,
  ): Promise<Record<string, unknown>[]> => {
    const subscriptions = await this.Isub.getSubscriptions(filter, subStatus);
    if (subscriptions == null) return null;
    if (group != null) {
      const groupSubscriptors = new GroupSubscriptors(
        subscriptions,
        (payload: ICatalog) => this.Iperiod.getByParam(payload),
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
      (payload: ICatalog) => this.Iperiod.getByParam(payload),
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
  //#endregion
  //#region Cron Jobs
  //   //** deactivate subscriptions */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'deactivateSubscription',
    timeZone: 'America/Managua',
  })
  public async Scheduler() {
    const period = await this.Iperiod.getByParam(
      plainToInstance(BillingIdentifierDto, { isActive: true }),
    );
    const restDays = period.FormatedDates()['restDays'];
    const subscriptionDetails = await this.Isub.getSubscriptionsDetail(
      'billingPeriodId',
      period.periodId,
    );
    subscriptionDetails.forEach(async (sub) => {
      try {
        const setStatus =
          scheduler[Number(restDays) < -3 ? '-3' : JSON.stringify(restDays)];
        sub.subscriptionStatus = setStatus;
        // await this.Isub.modifySubscriptions(sub);
      } catch (error) {
        //         //TODO: Inadmisible no controlar cualquier excepcion
        console.error(error);
      }
    });
  }
  //#endregion
}
