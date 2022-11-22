import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  NotificationService,
  DataModel,
  GroupNotification,
  FcmModel,
} from '../../../shared/notification';
import { UsersService } from '../../users/users.service';
import { GroupsService } from '../groups.service';

@Injectable()
export class GroupListener {
  constructor(
    private readonly notification: NotificationService,
    private readonly groupService: GroupsService,
    private readonly userService: UsersService,
  ) {}

  /**
   * * this event its dispatched when the group change the owner
   * * Modified Date: 16/11/22
   * @
   */
  @OnEvent('onChangedOwner', { async: true })
  public async handleOwnerChange(newAuthor: string, groupId: string) {
    try {
      const sender = '';
      const group = await this.groupService.findOneAsync(groupId);
      const owner = group.users.find((x) => x.uid === newAuthor);
      const notification = new GroupNotification(
        group.id,
        group.author.uid,
        group.groupProfile,
        group.isPrivate,
      );
      const mss = `Ahora tu eres el nuevo Owner!!`;
      const fcmModel = FcmModel.fcmPayload(
        owner.token,
        group.groupName,
        sender,
        mss,
        new DataModel(null, notification),
      );
      await this.notification.sendMessage(fcmModel);
    } catch (error) {
      console.error(`Error de evento: ${error}`);
    }
  }

  /**
   * @Author => Ernesto Lebni Miranda Escobar
   * @ModifiedDate => 2/24/2022
   * @Description  => Evento que se desencadena cada vez que un integrante se sale del grupo;
   * @Status => Bug Resuelto
   */
  @OnEvent('onExit', { async: true })
  public async handleExitUser(author: string, userId: string, groupId: string) {
    try {
      const group = await this.groupService.findOneAsync(groupId);
      const owner = await this.userService.findOne(author);
      const user = await this.userService.findOne(userId);
      const mss = `${user.nickName} ha salido del grupo...`;
      const notification = new GroupNotification(
        group.id,
        group.author.uid,
        group.groupProfile,
        group.isPrivate,
      );
      await this.notification.sendMessage(
        FcmModel.fcmPayload(
          owner.token,
          group.groupName,
          '',
          mss,
          new DataModel(null, notification),
        ),
      );
    } catch (e) {
      console.error(`Error encontrado al desatar el evento onExit ${e}`);
      throw new Error(e);
    }
  }

  @OnEvent('onAddMember', { async: true })
  public async handleAddedMember(payload: string, id: string) {
    try {
      const group = await this.groupService.findOneAsync(id);
      const owner = group.author;
      const applicant = await this.userService.findOne(payload);
      const mss = `${applicant.nickName} ha sido añadido al grupo ${group.groupName}`;
      const notification = new GroupNotification(
        group.id,
        group.author.uid,
        group.groupProfile,
        group.isPrivate,
      );
      await this.notification.sendMessage(
        FcmModel.fcmPayload(
          owner.token,
          group.groupName,
          '',
          mss,
          new DataModel(null, notification),
        ),
      );
    } catch (e) {
      console.error(`Error encontrado al desatar el evento onAddMember ${e}`);
      throw new Error(e);
    }
  }

  @OnEvent('onAccess', { async: true })
  public async handleAccess(userId: string, groupId: string) {
    try {
      const group = await this.groupService.findOneAsync(groupId);
      const applicant = await this.userService.findOne(userId);
      const owner = group.author;
      const mss = `${owner.nickName} te ha dado acceso para unirte a ${group.groupName}`;
      const notification = new GroupNotification(
        group.id,
        group.author.uid,
        group.groupProfile,
        group.isPrivate,
      );
      await this.notification.sendMessage(
        FcmModel.fcmPayload(
          applicant.token,
          group.groupName,
          '',
          mss,
          new DataModel(null, notification),
        ),
      );
    } catch (e) {
      console.error(`Error encontrado al desatar el evento onAccess ${e}`);
      throw new Error(e);
    }
  }
}
