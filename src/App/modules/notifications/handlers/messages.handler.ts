import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { GroupSettings } from '../../groups/dto/create-group.dto';
import { messageException } from '../../messages/constants/messages.exceptions';
import { DirectNotification, GroupNotification } from '../events/fcmModels';
import {
  ChatMessageCreated,
  GroupMessageCreated,
} from '../events/messageEvents/message-created';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class MessageListener {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly notificationSvc: NotificationsService) {}

  /**
   * *
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 2/24/2022
   * @Description  => Notificación push al enviar mensajes en grupos;
   * @Status => Estable
   */
  @OnEvent('message.groupMessage', { async: true })
  public async handleGroupMessages(messageGroupEvent: GroupMessageCreated) {
    try {
      const settings = plainToInstance(
        GroupSettings,
        messageGroupEvent.group.groupSettings,
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
   * *
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 2/24/2022
   * @Description  => Notificación push al enviar mensajes en grupos;
   * @Status => Estable
   */
  @OnEvent('message.chatmessage', { async: true })
  public async handleChatMessages(messageChatEvent: ChatMessageCreated) {
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
      });
      await messageChatEvent.executeFunction();
    } catch (error) {
      console.log(error);
    }
  }
}
