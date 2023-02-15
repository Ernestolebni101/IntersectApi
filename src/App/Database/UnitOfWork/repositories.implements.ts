import { IUnitOfWorkRepository } from '../IUnitOfWork/interfaces.unitofWork';
import { GroupsRepository } from 'src/App/modules/groups/repository/groups.repository';
import { UsersRepository } from 'src/App/modules/users';
import { MessageRepository } from 'src/App/modules/messages/repository/message.repository';
import { WaitListRepository } from 'src/App/modules/groups/waiting-list/repository/waiting-list-repository';
import { ChatRepository } from 'src/App/modules/chats/repository/chat-repository';
import { BillingPeriodRepository } from 'src/App/modules/admon/catalogs/billing-period/repository/period.repository';
import { SubHeadRepository } from 'src/App/modules/admon/subscriptions/repository/sub-head.repository';
import { SubscriptionDetail } from 'src/App/modules/admon/subscriptions/dtos/read-subscriptions.dto';
import { IAbstractRepository } from 'src/App/shared/utils/query.interface';

export class UnitOfWorkRepository implements IUnitOfWorkRepository {
  constructor(
    public readonly userRepository: UsersRepository,
    public readonly groupsRepository: GroupsRepository,
    public readonly messageRepository: MessageRepository,
    public readonly waitListRepository: WaitListRepository,
    public readonly chatRepository: ChatRepository,
    public readonly subDetailRepo?: IAbstractRepository<SubscriptionDetail>,
    public readonly billingRepo?: BillingPeriodRepository,
    public readonly subRepo?: SubHeadRepository,
  ) {}
}
