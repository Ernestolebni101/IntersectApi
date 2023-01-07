import { Group } from 'src/App/modules/groups/entities/group.entity';
import { UserDto } from 'src/App/modules/users/dto/read-user.dto';
import { BillingPeriodDto } from '../../catalogs/billing-period/dtos/read-billing-period.dto';
import { ICatalog } from '../../catalogs/catalog.interface';
import { Subscription } from '../entities/subscription.entities';
import { SubscriptorBase } from './subscriptorBase.helper';
export class UserSubscriptions extends SubscriptorBase {
  constructor(
    private subscriptions: Subscription[],
    private fn: (param: ICatalog) => Promise<BillingPeriodDto>,
    private userInfo: UserDto,
    private group: Record<string, Group>,
  ) {
    super(subscriptions, fn, userInfo);
  }

  public getSubscriptions = async (): Promise<Record<string, unknown>[]> =>
    await super.subscriptionInfo(this.group);
}
