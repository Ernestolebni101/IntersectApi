import { IWaitListRepository } from '../../modules/groups/waiting-list/repository/waiting-list-repository';
import { IMessageRepository } from '../../modules/messages/repository/message.repository';
import { IGroupsRepository } from '../../modules/groups/repository/groups.repository';
import { IUserRepository } from '../../modules/users/repository/user.repository';
import { IChatRepository } from 'src/App/modules/chats/repository/chat-repository';
/**
 * @description => Provee el acceso a los repositorios
 */
export interface IUnitOfWork {
  create(): IUnitOfWorkAdapter;
}

/**
 * @description => Genera la conexión con la base de Datos y los repositorios
 */
export interface IUnitOfWorkAdapter {
  Repositories: IUnitOfWorkRepository;
}

/**
 * @description => Contiene las Abstracciones de los Repositorios
 */
export interface IUnitOfWorkRepository {
  userRepository: IUserRepository;
  groupsRepository: IGroupsRepository;
  messageRepository: IMessageRepository;
  waitListRepository: IWaitListRepository;
  chatRepository: IChatRepository;
}
