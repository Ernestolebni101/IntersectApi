import { Group } from 'src/App/modules/groups/entities/group.entity';
import { UserDto } from 'src/App/modules/users/dto/read-user.dto';
import { BillingPeriodDto } from '../../catalogs/billing-period/dtos/read-billing-period.dto';
import { ICatalog } from '../../catalogs/catalog.interface';
import { Subscription } from '../entities/subscription.entities';
import { Descriptor } from '../utils/descriptor.utils';
import { SubscriptorBase } from './subscriptorBase.helper';
export class UserSubscriptions extends SubscriptorBase {
  constructor(
    private subscriptions: Subscription[],
    private fn: (param: ICatalog) => Promise<BillingPeriodDto>,
    private fn_group: (id: string) => Promise<Group>,
    private fn_user: (id: string) => Promise<UserDto>,
    private group: Record<string, Group>,
  ) {
    const groups = Descriptor.Distinct(
      subscriptions.map((sub) => sub.subscriptionDetail).flat(),
      'groupId',
      fn_group,
    ) as Promise<Record<string, UserDto>>;
    const userInfo = {} as Promise<Record<string, UserDto>>;
    super(subscriptions, fn, userInfo, false);
  }

  public getSubscriptions = async (): Promise<Record<string, unknown>[]> =>
    await super.subscriptionInfo(this.group);
}
