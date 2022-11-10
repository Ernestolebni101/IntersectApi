import { ForbiddenException, Injectable } from '@nestjs/common';
import { plainToClass } from 'fireorm/node_modules/class-transformer';
import { UnitOfWorkAdapter } from '../../../Database/UnitOfWork/adapter.implements';
import { UserDto } from '../../users/dto/read-user.dto';
import { IUserRepository } from '../../users/repository/user.repository';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageDto, newMessageDto } from '../dto/read-message.dto';
import { IMessageRepository } from '../repository/message.repository';
import { Message } from '../entities/message.entity';
import { IGroupsRepository } from '../../groups/repository/groups.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IChatRepository } from '../../chats/repository/chat-repository';
import { Params } from '../constants/messages.constants';
import { GroupMessageCreated } from '../../notifications/events/messageEvents/message-created';

@Injectable()
export class MessagesService {
  private userRepository: IUserRepository;
  private messageRepository: IMessageRepository;
  private groupsRepository: IGroupsRepository;
  private chatRepository: IChatRepository;
  constructor(
    private readonly adapter: UnitOfWorkAdapter,
    private readonly emitter: EventEmitter2,
  ) {
    this.userRepository = adapter.Repositories.userRepository;
    this.messageRepository = adapter.Repositories.messageRepository;
    this.groupsRepository = adapter.Repositories.groupsRepository;
    this.chatRepository = adapter.Repositories.chatRepository;
  }

  /**
   * @Note Aparentemente hay una mezcla desordenada de usuarios y mensajes
   * mejorarlo comparando uno por uno
   * @param group es el parametro que se utiliza para buscar los mensajes
   * @returns Una promesa de lista de mensajes de transferencia de datos
   */
  public findMessages = async (group: string): Promise<MessageDto[]> => {
    const messages = await this.messageRepository.getByGroups(group);
    const uids = messages.flatMap((c) => c.messageFrom);
    const messageDto = messages.map((m: Message) =>
      plainToClass(MessageDto, m),
    );
    let user: UserDto = new UserDto();
    for (const uid of uids) {
      user = await this.userRepository.getUserbyId(uid);
      messageDto.forEach((x) => (x.messageFrom = user));
    }
    return messageDto;
  };

  /**
   * TODO: Refactorizar el Switch case, lleva demasiado codigo y no se entiende bien
   * @param files Archivos de mensajes
   * @param payload carga de los datos
   * @param params  parametros, para identificar si a mensajes directos o para grupos
   * @returns newMessageDto
   */
  public saveMessages = async (
    files: Array<Express.Multer.File>,
    payload: CreateMessageDto,
    params: Params,
  ): Promise<newMessageDto> => {
    try {
      let responseMessage = new newMessageDto();
      const sender = await this.userRepository.getUserbyId(payload.messageFrom);
      payload.nickName = sender.nickName;
      payload.profilePic = sender.profilePic;
      switch (params) {
        case Params.DirectMessage:
          const receptorUid = (
            await this.chatRepository.getChatAsync(payload.fromGroup)
          ).users
            .filter((x) => x !== payload.messageFrom)
            .toString();
          const receptor: UserDto = await this.userRepository.getUserbyId(
            receptorUid,
          );
          responseMessage = await this.messageRepository.saveMessages(
            files,
            payload,
            await this.adapter.getBucket(),
          );
          await this.emitter.emitAsync('onUserMessages', payload, receptor);
          break;
        case Params.GroupMessage:
          const group = await this.groupsRepository.getById(payload.fromGroup);
          if (!group.users.includes(payload.messageFrom)) {
            throw new ForbiddenException(
              payload,
              'El usuario no tiene permiso para enviar el mensaje',
            );
          }
          group.users = group.users.filter((x) => !(x === payload.messageFrom));
          const receptors = await group.users.reduce(async (acc, uid) => {
            const collection: Array<UserDto> = await acc;
            collection.push(await this.userRepository.getUserbyId(uid));
            return collection;
          }, Promise.resolve(new Array<UserDto>()));
          responseMessage = await this.messageRepository.saveMessages(
            files,
            payload,
            await this.adapter.getBucket(),
          );
          const messageEvent = new GroupMessageCreated(
            payload,
            group,
            receptors.flatMap((r) => r.token),
            this.groupsRepository.updateGroup,
          );
          await this.emitter.emitAsync('message.groupMessage', messageEvent);
          break;
      }
      return responseMessage;
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * Este metodo elimina mensajes segun el id
   * @param id identificador unico del mensaje
   */
  public async DeleteMessages(id: string) {
    try {
      await this.messageRepository.deleteMessages(id);
    } catch (e) {
      console.error(`Ha ocurrido una excepcion al borrar los mensajes: ${e}`);
      throw new Error(e);
    }
  }
}
