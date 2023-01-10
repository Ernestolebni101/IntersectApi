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
    private groupMap: Record<string, Group>,
  ) {
    super(subscriptions, fn, true);
  }

  public getSubscriptors = async (): Promise<Record<string, unknown>[]> => {
    const uids = Object.values(this.groupMap).flatMap((g) =>
      g.users.filter((uid) => uid != g.author),
    );
    const users = await Promise.all(
      uids.map(async (uid) => await this.fn_userById(uid)),
    );
    const userMap = Descriptor.toHashMap(users, 'uid') as Record<
      string,
      UserDto
    >;
    return await super.subscriptionInfo(this.groupMap, userMap);
  };
}
