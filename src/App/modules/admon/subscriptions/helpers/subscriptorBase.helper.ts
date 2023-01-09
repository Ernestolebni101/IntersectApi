import { plainToInstance } from 'class-transformer';
import { Group } from 'src/App/modules/groups/entities/group.entity';
import { UserDto } from 'src/App/modules/users/dto/read-user.dto';
import { Time } from 'src/Utility/utility-time-zone';
import {
  BillingIdentifierDto,
  BillingPeriodDto,
} from '../../catalogs/billing-period/dtos/read-billing-period.dto';
import { ICatalog } from '../../catalogs/catalog.interface';
import {
  Subscription,
  SubscriptionDetail,
} from '../entities/subscription.entities';
//TODO:  SEPARARLO A UNA INTERFAZ
export class SubscriptorBase {
  constructor(
    private subcriptions: Subscription[],
    private periodCallback: (param: ICatalog) => Promise<BillingPeriodDto>,
    public user: Promise<Record<string, UserDto>>,
    public isByGroup: boolean = false,
  ) {}
  protected async subscriptionInfo(
    groupArgs: Record<string, Group>,
  ): Promise<Record<string, unknown>[]> {
    const userWithSubscription = await Promise.all(
      this.subcriptions.map(async (subHead) => {
        const transactionDetail = await this.getTransactionDetail(
          subHead.subscriptionDetail,
          groupArgs,
          subHead.userId,
        );
        return {
          subscriptionId: subHead.subscriptionId,
          joinDate: Time.getCustomDate(new Date(subHead.createdDate), 'long'),
          transactionDetail,
        };
      }),
    );
    return userWithSubscription;
  }
  private getTransactionDetail(
    detail: SubscriptionDetail[],
    groupArgs: Record<string, Group>,
    userId: string,
  ): Promise<Record<string, unknown>[]> {
    return Promise.all(
      detail.map(async (sub) => {
        const { groupName, groupProfile, author } = groupArgs[sub.groupId];
        const userMap = await this.user;
        const { firstName, lastName, nickName } =
          userMap[!this.isByGroup ? author : userId];
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
          additionalInfo: {
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
