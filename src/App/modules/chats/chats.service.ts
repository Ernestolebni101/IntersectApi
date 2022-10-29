import { Injectable } from '@nestjs/common';
import { UnitOfWorkAdapter } from 'src/App/Database/UnitOfWork/adapter.implements';
import { IMessageRepository } from '../messages/repository/message.repository';
import { IUserRepository } from '../users/repository/user.repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatDto, ChatUserDto } from './dto/read-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { IChatRepository } from './repository/chat-repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IntersectGateway } from '../../app.gateway';
import { User } from '../users/entities/user.entity';
@Injectable()
export class ChatsService {
  private readonly chatRepository: IChatRepository;
  private readonly userRepository: IUserRepository;
  private readonly messageRepository: IMessageRepository;
  constructor(
    private readonly adapter: UnitOfWorkAdapter,
    private readonly eventEmitter: EventEmitter2,
    private readonly chateGateway: IntersectGateway,
  ) {
    this.chatRepository = adapter.Repositories.chatRepository;
    this.userRepository = adapter.Repositories.userRepository;
    this.messageRepository = adapter.Repositories.messageRepository;
  }

  public createChatAsync = async (payload: CreateChatDto): Promise<ChatDto> => {
    try {
      const chat = await this.chatRepository.createChatAsync(payload);
      const model = new ChatDto();
      model.id = chat.id;
      model.user = await chat.users.reduce(async (promiseArray, element) => {
        const asyncArray = await promiseArray;
        const copy = ChatUserDto.Factory(
          await this.userRepository.getUserbyId(element),
        );
        asyncArray.push(copy);
        return asyncArray;
      }, Promise.resolve(new Array<ChatUserDto>()));
      this.chateGateway.server.emit('onChat', model);
      return model;
    } catch (error) {
      throw new Error(error);
    }
  };

  public async findUserChats(uid: string): Promise<Array<ChatDto>> {
    try {
      const chats = await this.adapter.Repositories.chatRepository.getUserChats(
        uid,
      );
      const principalUser = ChatUserDto.Factory(
        await this.userRepository.getUserbyId(uid),
      );
      const otherUsers = (
        await this.userRepository.getUsersByUids(
          chats.flatMap((x) => x.users).filter((x) => x !== uid),
        )
      ).map((u: User) => ChatUserDto.Factory(u));
      const fields = await chats.reduce(
        async (chatAcc, chatItem, currentIndex) => {
          const asynAcc = await chatAcc;
          const array = [principalUser, otherUsers[currentIndex]];
          asynAcc.push(
            ChatDto.Factory(
              chatItem.id,
              await this.messageRepository.getByGroups(chatItem.id),
              array,
            ),
          );
          return asynAcc;
        },
        Promise.resolve(new Array<ChatDto>()),
      );
      return fields;
    } catch (error) {
      throw new Error(error);
    }
  }

  public updateChatAsync = async (payload: UpdateChatDto): Promise<void> => {
    try {
      await this.chatRepository.updateChatAsync(payload);
    } catch (error) {
      console.error(`Error en updateChatAsync: ${error}`);
      throw new Error(error);
    }
  };

  public removeAsync = async (chatId: string): Promise<void> => {
    await this.chatRepository.removeAsync(chatId, this.eventEmitter);
  };
}
