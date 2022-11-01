import { BaseFirestoreRepository, CustomRepository } from 'fireorm';
import { Chat } from '../entities/chat.entity';
import { CreateChatDto } from '../dto/create-chat.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export interface IChatRepository {
  getChatAsync(chatId: string): Promise<Chat>;
  createChatAsync(payload: CreateChatDto): Promise<Chat>;
  getUserChats(uid: string): Promise<Array<Chat>>;
  updateChatAsync(payload: UpdateChatDto): Promise<void>;
  removeAsync(chatId: string, eventEmitter: EventEmitter2): Promise<void>;
}

@CustomRepository(Chat)
export class ChatRepository
  extends BaseFirestoreRepository<Chat>
  implements IChatRepository
{
  public getChatAsync = async (chatId: string): Promise<Chat> =>
    await this.findById(chatId);

  public getUserChats = async (uid: string): Promise<Array<Chat>> => {
    const chats = await this.whereArrayContains((x) => x.users, uid).find();
    return chats.sort((a, b) => a.flag - b.flag).reverse();
  };

  public updateChatAsync = async (payload: UpdateChatDto): Promise<void> => {
    try {
      const foundChat = await this.getChatAsync(payload.id);
      foundChat.flag = payload.flag;
      foundChat.modifiedDate = payload.modifiedDate;
      await this.update(foundChat);
    } catch (e) {
      console.error(`Error en el método updateChatAsync: ${e}`);
      throw new Error(e);
    }
  };

  public removeAsync = async (
    chatId: string,
    eventEmitter: EventEmitter2,
  ): Promise<void> => {
    await this.runTransaction(async (tran) => {
      await tran.delete(chatId);
      await eventEmitter.emitAsync('onDeleteCacade', chatId);
    });
  };

  public createChatAsync = async (payload: CreateChatDto): Promise<Chat> => {
    try {
      const model = plainToInstance(Chat, payload);
      const fields = await this.find();
      const index = fields.findIndex(
        (c) => c.users.sort().toString() === payload.users.sort().toString(),
      );
      const retrieve = index != -1 ? fields[index] : await this.create(model);
      return retrieve;
    } catch (error) {
      throw new Error(error);
    }
  };
}
