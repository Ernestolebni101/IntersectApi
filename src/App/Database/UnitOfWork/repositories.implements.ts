import { IUnitOfWorkRepository } from '../IUnitOfWork/interfaces.unitofWork';
import { Inject, Injectable } from '@nestjs/common';
import { repo } from '../database-providers/repository.provider';
import { GroupsRepository } from 'src/App/modules/groups/repository/groups.repository';
import { UsersRepository } from 'src/App/modules/users';
import { MessageRepository } from 'src/App/modules/messages/repository/message.repository';
import { WaitListRepository } from 'src/App/modules/groups/waiting-list/repository/waiting-list-repository';
import { ChatRepository } from 'src/App/modules/chats/repository/chat-repository';
import { SubscriptionDetailRepository } from 'src/App/modules/admon/subscriptions/repository/subscription-detail.repository';
@Injectable()
export class UnitOfWorkRepository implements IUnitOfWorkRepository {
  constructor(
    @Inject(repo.USERS) public readonly userRepository: UsersRepository,
    @Inject(repo.GROUPS) public readonly groupsRepository: GroupsRepository,
    @Inject(repo.MESSAGES)
    public readonly messageRepository: MessageRepository,
    @Inject(repo.WAITLIST)
    public readonly waitListRepository: WaitListRepository,
    @Inject(repo.CHATS) public readonly chatRepository: ChatRepository,
    @Inject(repo.SUBDETAIL)
    public readonly subDetailRepo: SubscriptionDetailRepository,
  ) {}
}
