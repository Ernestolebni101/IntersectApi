import { IUnitOfWorkRepository } from '../IUnitOfWork/interfaces.unitofWork';
import { UsersRepository } from '../../modules/users/repository/user.repository';
import { User } from '../../modules/users/entities/user.entity';
import {
  GroupsRepository,
  IGroupsRepository,
} from '../../modules/groups/repository/groups.repository';
import { Group } from '../../modules/groups/entities/group.entity';
import {
  IMessageRepository,
  MessageRepository,
} from 'src/App/modules/messages/repository/message.repository';
import { Message } from '../../modules/messages/entities/message.entity';
import {
  IWaitListRepository,
  WaitListRepository,
} from 'src/App/modules/groups/waiting-list/repository/waiting-list-repository';
import { WaitingList } from 'src/App/modules/groups/waiting-list/entities/waiting-list.entity';
import {
  ChatRepository,
  IChatRepository,
} from 'src/App/modules/chats/repository/chat-repository';
import { Chat } from 'src/App/modules/chats/entities/chat.entity';

export class UnitOfWorkRepository implements IUnitOfWorkRepository {
  public readonly userRepository: UsersRepository;
  public readonly groupsRepository: IGroupsRepository;
  public readonly messageRepository: IMessageRepository;
  public readonly waitListRepository: IWaitListRepository;
  public readonly chatRepository: IChatRepository;
  constructor() {
    this.userRepository = new UsersRepository(User);
    this.groupsRepository = new GroupsRepository(Group);
    this.messageRepository = new MessageRepository(Message);
    this.waitListRepository = new WaitListRepository(WaitingList);
    this.chatRepository = new ChatRepository(Chat);
  }
}
