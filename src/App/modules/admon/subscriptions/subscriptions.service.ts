import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UnitOfWorkAdapter } from 'src/App/Database';
import { UpdateGroupDto } from '../../groups/dto/update-group.dto';
import { Group } from '../../groups/entities/group.entity';
import { IGroupsRepository } from '../../groups/repository/groups.repository';
import { IUserRepository } from '../../users/repository/user.repository';
import {
  SubscriptionRepository,
  Subscription,
  createSubscriptionDto,
  BillingIdentifierDto,
  BillingPeriodRepository,
  SubscriptionDto,
} from '../index';
import { Descriptor } from './utils/descriptor.utils';

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
  //TODO: MEJORAR EL CODIGO; El periodo de la suscripcion va en la cabecera y los estados de la suscripcion van en el detalle
  public getUserSubscriptions = async (
    filter: string,
  ): Promise<Record<string, unknown>[]> => {
    const subscription = await this.suscriptionRepo.getSubscriptions(filter);
    const [groups, users] = await Promise.all([
      await Descriptor.Distinct(
        subscription.flatMap((sub) => sub.subscriptionDetail),
        'groupId',
        this.Igroup.getById,
      ),
      await this.Iuser.getUserbyId(subscription[0].userId),
    ]);
    const usersWithSuscriptions = await Promise.all(
      subscription.map(async (subHead) => ({
        subscriptionId: subHead.subscriptionId,
        transactionDetail: await Promise.all(
          subHead.subscriptionDetail.map(async (sub) => {
            const { groupName } = groups[sub.groupId];
            const { firstName, lastName, nickName } = users;
            const period = await this.periodRepo.getByParam(
              plainToInstance(
                BillingIdentifierDto,
                { isActive: true },
                { ignoreDecorators: true },
              ),
            );
            return {
              ...sub,
              beginDate: period[0].startDate,
              endDate: period[0].endDate,
              ownerInfo: {
                name: `${firstName} ${lastName}`,
                nickName: nickName,
                group: groupName,
              },
            };
          }),
        ),
      })),
    );
    return usersWithSuscriptions;
  };
}
