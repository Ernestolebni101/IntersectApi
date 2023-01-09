import { Group } from 'src/App/modules/groups/entities/group.entity';
import { UserDto } from 'src/App/modules/users/dto/read-user.dto';
import { BillingPeriodDto } from '../../catalogs/billing-period/dtos/read-billing-period.dto';
import { ICatalog } from '../../catalogs/catalog.interface';
import { Subscription } from '../entities/subscription.entities';
import { Descriptor } from '../utils/descriptor.utils';
import { SubscriptorBase } from './subscriptorBase.helper';

export class GroupSubscriptors extends SubscriptorBase {
  constructor(
    private subscriptions: Subscription[],
    private fn: (param: ICatalog) => Promise<BillingPeriodDto>,
    private fn_userById: (id: string) => Promise<UserDto>,
    private groupArgs: Record<string, Group>,
  ) {
    const userInfo = Descriptor.Distinct(
      subscriptions,
      'userId',
      fn_userById,
    ) as Promise<Record<string, UserDto>>;
    super(subscriptions, fn, userInfo, true);
  }

  public getSubscriptors = async (): Promise<Record<string, unknown>[]> =>
    await super.subscriptionInfo(this.groupArgs);
}
