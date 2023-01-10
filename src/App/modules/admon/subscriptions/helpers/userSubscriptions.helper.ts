import { Group } from 'src/App/modules/groups/entities/group.entity';
import { UserDto } from 'src/App/modules/users/dto/read-user.dto';
import { BillingPeriodDto } from '../../catalogs/billing-period/dtos/read-billing-period.dto';
import { ICatalog } from '../../catalogs/catalog.interface';
import { Subscription } from '../entities/subscription.entities';
import { Descriptor } from '../utils/descriptor.utils';
import { SubscriptorBase } from './subscriptorBase.helper';
//** Aca solo se manda la informacion de subscripcion por cada grupo, por lo que es necesario la informacion de los owners
export class UserSubscriptions extends SubscriptorBase {
  constructor(
    private subscriptions: Subscription[],
    private fn: (param: ICatalog) => Promise<BillingPeriodDto>, // necesario
    private groupMap: Record<string, Group>, // necesario -> filtro de todos los usuarios por grupo
    private fn_user: (id: string) => Promise<UserDto>,
  ) {
    super(subscriptions, fn, false);
  }

  public getSubscriptions = async (): Promise<Record<string, unknown>[]> => {
    const users = await Promise.all(
      Object.values(this.groupMap).map(
        async (g) => await this.fn_user(g.author),
      ),
    );
    return await super.subscriptionInfo(
      this.groupMap,
      Descriptor.toHashMap(users, 'uid'),
    );
  };
}
