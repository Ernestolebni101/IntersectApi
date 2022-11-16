import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '../../../users/users.service';
import { GroupsService } from '../../groups.service';
import { WaitingListService } from '../waiting-list.service';
import { UpdateWaitingListDto } from '../dto/update-waiting-list.dto';
import { MemberOpt, UpdateGroupDto } from '../../dto/update-group.dto';
import {
  GroupNotification,
  DataModel,
  NotificationService,
  FcmModel,
} from '../../../../shared/notification/index';
import { CreateWaitingListDto } from '../dto/create-waiting-list.dto';
import { GroupDto } from '../../dto/read-group.dto';
import { UserDto } from '../../../users/dto/read-user.dto';

@Injectable()
export class WaitListEventHandlers {
  // Incrustar repositorio de usuarios y servicio de Notificaciones
  constructor(
    private readonly notification: NotificationService,
    private readonly groupService: GroupsService,
    private readonly userService: UsersService,
    private readonly waitlistService: WaitingListService,
  ) {}
  @OnEvent('onDeniedOrBanned', { async: true })
  public async handleDeniedOrBannedRequest(payload: UpdateWaitingListDto) {
    try {
      const [group, applicant] = await Promise.all<[GroupDto, UserDto]>([
        await this.groupService.findOneAsync(payload.groupId),
        await this.userService.findOne(payload.userId),
      ]);
      let fcmModel: any;
      const mssdenied = `Se le ha denegado su solicitud para unirse al grupo "${group.groupName}"`;
      const mssbanned = `Se le notifica que usted ha sido bloqueado del grupo "${group.groupName}"`;
      const notification = new GroupNotification(
        group.id,
        group.author.uid,
        group.groupProfile,
        group.isPrivate,
      );
      if (payload.isBanned) {
        fcmModel = FcmModel.fcmPayload(
          applicant.token,
          group.groupName,
          '',
          mssbanned,
          new DataModel(null, notification),
        );
        await this.notification.sendMessage(fcmModel);
      } else if (payload.isAccepted === false) {
        fcmModel = FcmModel.fcmPayload(
          applicant.token,
          group.groupName,
          '',
          mssdenied,
          new DataModel(null, notification),
        );
        await this.notification.sendMessage(fcmModel);
      }
    } catch (error) {
      console.error(`Error encontrado al desatar el evento: ${error}`);
      throw new Error(error);
    }
  }
  /**
   * *Evento que actualiza los datos del grupo
   * @param payload Datos para actualizar los datos de una lista
   */
  @OnEvent('onAcceptedRequest', { async: true })
  public async handleAcceptedRequest(payload: UpdateWaitingListDto) {
    try {
      const updateModel = new UpdateGroupDto();
      updateModel.id = payload.groupId;
      updateModel.memberOption = MemberOpt.addMember;
      updateModel.userId = payload.userId;
      await this.groupService.updateGroupData(null, updateModel); // este metodo desencadena su propio evento
    } catch (error) {
      console.error(`Error encontrado al desatar el evento ${error}`);
      throw new Error(error);
    }
  }
  /**
   * Este evento maneja las solicitudes a union de grupos privadas
   * @param payload Cara util para emitir el evento de enviar una notificacion cuando se solicita entrar a un grupo privado
   * @param id Id del  grupo
   * @Note Se ha añadido el bloqueo de notificaciones una vez que los grupos están cerrados
   */
  @OnEvent('onRequestToJoin', { async: true })
  public async handleRequest(payload: string, id: string) {
    try {
      const [bannedList, group, applicant] = await Promise.all([
        await this.waitlistService.fetchBannedUsers(id),
        await this.groupService.findOneAsync(id),
        await this.userService.findOne(payload),
      ]);
      const isBanned = bannedList?.flatMap((x) => x.user.uid);
      if (!isBanned.includes(payload)) {
        await this.waitlistService.create(
          new CreateWaitingListDto({
            id: id,
            uid: applicant.uid,
            isBanned: false,
            isAccepted: null,
          }),
        );
        const notification = new GroupNotification(
          group.id,
          group.author.uid,
          group.groupProfile,
          group.isPrivate,
        );
        if (group.isActive) {
          const mss = `${applicant.nickName} ha solicitado unirse al grupo "${group.groupName}"`;
          await this.notification.sendMessage(
            FcmModel.fcmPayload(
              group.author.token,
              group.groupName,
              '',
              mss,
              new DataModel(null, notification),
            ),
          );
        }
      }
    } catch (e) {
      console.error(
        `Error encontrado al desatar el evento onRequestToJoin: ${e}`,
      );
    }
  }
  /**
   * Este evento maneja las solicitudes que han quedado pendientes mientras los grupos permanecían cerrados
   * y no se enviaban las notificaciones push
   * @Note Se ha añadido el bloqueo de notificaciones una vez que los grupos están cerrados
   */
  @OnEvent('onOpenGroup', { async: true })
  public async handleOpenGroup(groupId: string) {
    try {
      const group = await this.groupService.findOneAsync(groupId);
      const pendingRequests = await this.waitlistService.fetchRequestsAsync(
        groupId,
      );
      const notification = new GroupNotification(
        group.id,
        group.author.uid,
        group.groupProfile,
        group.isPrivate,
      );
      pendingRequests.forEach(async (r) => {
        await this.notification.sendMessage(
          FcmModel.fcmPayload(
            group.author.token,
            group.groupName,
            '',
            `${r.user.nickName} ha solicitado unirse al grupo "${group.groupName}"`,
            new DataModel(null, notification),
          ),
        );
      });
    } catch (e) {
      console.error(`Error encontrado al desatar el evento onOpenGroup: ${e}`);
      throw new Error(e);
    }
  }
}
