import { Injectable, NotImplementedException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatsService } from '../chats.service';
import { MessagesService } from '../../messages/services/messages.service';

@Injectable()
export class ChatsEventHandler {
  // Incrustar repositorio de usuarios y servicio de Notificaciones
  constructor(
    private readonly chatService: ChatsService,
    private readonly messageService: MessagesService,
  ) {}
  /**
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 3/23/2022
   * @Description  => Evento que se desencadena cada vez que el grupo cambia de Owner;
   * @Status => Estable
   */
  @OnEvent('onChatChange', { async: true })
  public async handleAnyChange(uid: string) {
    throw new NotImplementedException();
  }
}
