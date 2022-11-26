import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatsService } from '../chats.service';
@Injectable()
export class chatListener {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly chatService: ChatsService,
  ) {}

  @OnEvent('chat.create', { async: true })
  public async chatCaching(event: CreateChatDto) {
    event.users.forEach(async (u: string) => {
      const chats = await this.chatService.findUserChats(u);
      this.cache.set(`${u}-chats`, chats, 400);
    });
  }
}
