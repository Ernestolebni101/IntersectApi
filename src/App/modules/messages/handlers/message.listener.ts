/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { messageException } from '../helpers/messages.exceptions';
import { ChatMessageCreated, GroupMessageCreated } from '../index';
import { GroupNotification, DirectNotification, NotificationService } from '../../../shared/notification/index';
import { plainToInstance } from 'class-transformer';
import { GroupSettings } from '../../groups/dto/create-group.dto';
@Injectable()
export class MessageListener {

  constructor(
    private readonly notificationSvc: NotificationService,) {}

  /**
   * *revisado
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 2/24/2022
   * @Description  => Notificación push al enviar mensajes en grupos;
   * @Status => Estable
   */
  @OnEvent('group.messages', { async: true })
  public async handleMessageGroups(
    messageGroupEvent: GroupMessageCreated
  ) {
    try {
      const settings = messageGroupEvent.group.groupSettings.map((settings) =>
        plainToInstance(GroupSettings, settings),
      );
      settings.length == 0 && messageException['missingSettings']();
      const notification = new GroupNotification(
        messageGroupEvent.group.id,
        messageGroupEvent.group.author,
        messageGroupEvent.group.groupProfile,
        messageGroupEvent.group.isPrivate,
      );
      await this.notificationSvc.sendToDevices({
        notificationBody: notification,
        messageEvent: messageGroupEvent,
        settings: settings,
      });
      await messageGroupEvent.executeFunction();

    } catch (error) {
      console.log(error);
    }
  }

  /**
   * *revisado
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 27/07/2022
   * @Description  => Notificación push al enviar mensajes directos;
   * @Status => Estable
   * Se quitaron parametros  innecesarios
   */
  @OnEvent('direct.messages', { async: true })
  public async handleUserMessages(
    messageChatEvent: ChatMessageCreated
  ) {
    try {
      const notification = new DirectNotification(
        messageChatEvent.payloadMessage.fromGroup,
        [
          messageChatEvent.payloadMessage.messageFrom,
          messageChatEvent.user.uid,
        ],
        [
          messageChatEvent.payloadMessage.profilePic,
          messageChatEvent.user.profilePic,
        ],
      );
      await this.notificationSvc.sendToDevices({
        notificationBody: notification,
        messageEvent: messageChatEvent,
        typeNotify: 2});
      await messageChatEvent.executeFunction()
      
    } catch (error) {
      console.log(error);
    }
  }
}
