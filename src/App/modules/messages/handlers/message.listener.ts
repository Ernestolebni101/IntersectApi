/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from '../messaging/notifications';
import { DataModel, DirectNotification, FcmModel, GroupNotification } from '../messaging/fcmModels';
import { GroupsService } from '../../groups/groups.service';
import { UserDto } from '../../users/dto/read-user.dto';
import { Group } from '../../groups/entities/group.entity';
import { messaging } from 'firebase-admin/lib/messaging';
import { CreateMessageDto } from '../dto/create-message.dto';
import { ChatsService } from '../../chats/chats.service';
import { UpdateGroupDto } from '../../groups/dto/update-group.dto';
import { Time } from '../../../../Utility/utility-time-zone';
import { UpdateChatDto } from '../../chats/dto/update-chat.dto';
import { MessagesService } from '../services/messages.service';
import { plainToInstance } from 'class-transformer';
import { GroupSettings } from '../../groups/dto/create-group.dto';
import { messageException } from '../constants/messages.exceptions';

@Injectable()
export class MessageListener {

  constructor(
    private readonly notification: Notification,
    private readonly groupService: GroupsService,
    private readonly chatsService: ChatsService,
    private readonly messageService: MessagesService,
  ) {}

  /**
   *
   * *Operacion de eliminación en cascada
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 2/24/2022
   * @Description  => Notificación push al enviar mensajes en grupos;
   * @Status => Estable
   */
  @OnEvent('onDeleteCacade', { async: true })
  public async handleDeleteCascade(id: string) {
    await this.messageService.DeleteMessages(id);
  }

  /**
   * !Revisado
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 2/24/2022
   * @Description  => Notificación push al enviar mensajes en grupos;
   * @Status => Estable
   */
  @OnEvent('onGroupMessages', { async: true })
  public async handleMessageGroups(
    payload: CreateMessageDto,
    receptors: UserDto[],
    group: Group,
  ) {
    try {
    receptors == undefined && messageException['missingReceptors']();
    const settings = plainToInstance(GroupSettings,group.groupSettings);
    settings.length == 0 && messageException['missingSettings']();
    const upgradeModel = new UpdateGroupDto();
    upgradeModel.id = group.id;
    upgradeModel.flag = new Date().getTime(); 
    upgradeModel.modifiedDate = Time.getCustomDate(new Date(), 'T');
    upgradeModel.lastMessage = `${payload.nickName}: ${payload.messageContent}`;
    const tokens = receptors.flatMap((t) => t.token);
    let mss: messaging.Message;
    const imageUrl = payload.messageType === 'image' ? payload.mediaUrl[0].toString() : '';
    const notification = new GroupNotification(
      group.id,
      group.author,
      group.groupProfile,
      group.isPrivate,
    );
    const dataModel = new DataModel(null, notification)
    await this.notification.sendToDevices(tokens.map(t =>  FcmModel.fcmPayload(
      t,
      group.groupName,
      `${payload.nickName}:`,
      payload.messageContent,
      dataModel,
      imageUrl,
      group.groupProfile,
    )));
    // tokens.forEach(async (t) => {
    //     mss = FcmModel.fcmPayload(
    //       t,
    //       group.groupName,
    //       `${payload.nickName}:`,
    //       payload.messageContent,
    //       dataModel,
    //       imageUrl,
    //       group.groupProfile,
    //     );
    //     await this.notification.sendMessage(mss);
    // });
    await this.groupService.updateGroupData(undefined, upgradeModel);
    } catch (error) {
      console.log(error);
    }
    
  }

  /**
   * !revisado
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 27/07/2022
   * @Description  => Notificación push al enviar mensajes directos;
   * @Status => Estable
   * Se quitaron parametros  innecesarios
   */
  @OnEvent('onUserMessages', { async: true })
  public async handleUserMessages(
    payload: CreateMessageDto,
    receptor: UserDto,
  ) {
    try {
      const chatPayload = new UpdateChatDto();
      chatPayload.id = payload.fromGroup;
      chatPayload.flag = new Date().getTime();
      chatPayload.modifiedDate = Time.getCustomDate(new Date(), 'T');
      await this.chatsService.updateChatAsync(chatPayload);
      let mss: messaging.Message;
      const imageUrl = payload.messageType === 'image' ? payload.mediaUrl[0].toString() : '';
      const notification = new DirectNotification(chatPayload.id, [payload.messageFrom, receptor.uid], [payload.profilePic, receptor.profilePic]);
      // eslint-disable-next-line prefer-const
      mss = FcmModel.fcmPayload(
        receptor.token,
        'Mensaje Directo',
        `${payload.nickName}:`,
        payload.messageContent,
        new DataModel(notification, null),
        imageUrl,
        payload.profilePic,
      );
      await this.notification.sendMessage(mss);
    } catch (error) {
      console.error(`error originado en handleUserMessages : ${error}`);
      throw new Error(error);
    }
  }
}
