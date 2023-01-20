import { IUnitOfWorkRepository } from '../IUnitOfWork/interfaces.unitofWork';
import { GroupsRepository } from 'src/App/modules/groups/repository/groups.repository';
import { UsersRepository } from 'src/App/modules/users';
import { MessageRepository } from 'src/App/modules/messages/repository/message.repository';
import { WaitListRepository } from 'src/App/modules/groups/waiting-list/repository/waiting-list-repository';
import { ChatRepository } from 'src/App/modules/chats/repository/chat-repository';
import { SubscriptionDetailRepository } from 'src/App/modules/admon/subscriptions/repository/subscription-detail.repository';
import { BillingPeriodRepository } from 'src/App/modules/admon/catalogs/billing-period/repository/period.repository';
import { SubRepository } from 'src/App/modules/admon/subscriptions/repository/subrepository';

export class UnitOfWorkRepository implements IUnitOfWorkRepository {
  constructor(
    public readonly userRepository: UsersRepository,
    public readonly groupsRepository: GroupsRepository,
    public readonly messageRepository: MessageRepository,
    public readonly waitListRepository: WaitListRepository,
    public readonly chatRepository: ChatRepository,
    public readonly subDetailRepo?: SubscriptionDetailRepository,
    public readonly billingRepo?: BillingPeriodRepository,
    public readonly subRepo?: SubRepository,
  ) {}
}
