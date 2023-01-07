import { plainToInstance } from 'class-transformer';
import { Group } from 'src/App/modules/groups/entities/group.entity';
import { UserDto } from 'src/App/modules/users/dto/read-user.dto';
import {
  BillingIdentifierDto,
  BillingPeriodDto,
} from '../../catalogs/billing-period/dtos/read-billing-period.dto';
import { ICatalog } from '../../catalogs/catalog.interface';
import {
  Subscription,
  SubscriptionDetail,
} from '../entities/subscription.entities';

export class SubscriptorBase {
  constructor(
    private subcriptions: Subscription[],
    private periodCallback: (param: ICatalog) => Promise<BillingPeriodDto>,
    public user: UserDto,
  ) {}
  protected async subscriptionInfo(
    groupArgs: Record<string, Group>,
  ): Promise<Record<string, unknown>[]> {
    const userWithSubscription = await Promise.all(
      this.subcriptions.map(async (subHead) => {
        const transactionDetail = await this.getTransactionDetail(
          subHead.subscriptionDetail,
          groupArgs,
        );
        return {
          subscriptionId: subHead.subscriptionId,
          joinDate: subHead.createdDate,
          transactionDetail,
        };
      }),
    );
    return userWithSubscription;
  }
  private getTransactionDetail(
    detail: SubscriptionDetail[],
    groupArgs: Record<string, Group>,
  ): Promise<Record<string, unknown>[]> {
    return Promise.all(
      detail.map(async (sub) => {
        const { groupName, groupProfile } = groupArgs[sub.groupId];
        const { firstName, lastName, nickName } = this.user;
        const period = await this.periodCallback(
          plainToInstance(
            BillingIdentifierDto,
            { isActive: true },
            { ignoreDecorators: true },
          ),
        );
        return {
          ...sub,
          decoratedDate: period.FormatedDates(),
          groupInfo: {
            name: `${firstName} ${lastName}`,
            nickName: nickName,
            group: groupName,
            groupProfile: groupProfile,
          },
        };
      }),
    );
  }
}
