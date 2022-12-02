import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatsService, ChatDto, Chat } from '../index';

@Injectable()
export class chatListener {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly chatService: ChatsService,
  ) {}

  // TODO: dont repeat read process for each create chat operation
  @OnEvent('chat.reload', { async: true })
  public async onReload(event: string[]) {
    const result = await this.cache.get<Promise<ChatDto>>(event[0]);
    if (result == undefined) {
      event.forEach(async (u: string) => {
        const chats = await this.chatService.findUserChats(u);
        this.cache.set(`${u}-chats`, chats, 500);
      });
    }
  }
  @OnEvent('chat.remove', { async: true })
  public async onDeleteChat(
    event: string,
    fx: (chatId: string) => Promise<Chat>,
  ) {
    const ids = await fx(event);
    ids.users.forEach((e) => this.cache.del(`${e}-chats`));
  }
}
