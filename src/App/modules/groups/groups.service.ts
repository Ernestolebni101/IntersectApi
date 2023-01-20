import { Injectable } from '@nestjs/common';
import { UnitOfWorkAdapter } from '../../Database/UnitOfWork/adapter.implements';
import {
  joinType,
  UserDto,
  UserJoined,
  UserPartialDto,
} from '../users/dto/read-user.dto';
import { IUserRepository } from '../users/repository/user.repository';
import { GroupDto } from './dto/read-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { IGroupsRepository } from './repository/groups.repository';
import { Bucket } from '@google-cloud/storage';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IMessageRepository } from '../messages/repository/message.repository';
import { Time } from '../../../Utility/utility-time-zone';
import { User } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ISubscription } from '../admon/subscriptions/repository/subscription.repository';

@Injectable()
export class GroupsService {
  private readonly groupsRepository: IGroupsRepository;
  private readonly Iuser: IUserRepository;
  private readonly messageRepository: IMessageRepository;
  private readonly bucket: Promise<Bucket>;
  private readonly Isub: ISubscription;

  constructor(
    private readonly adapter: UnitOfWorkAdapter,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.groupsRepository = this.adapter.Repositories.groupsRepository;
    this.Iuser = this.adapter.Repositories.userRepository;
    this.messageRepository = this.adapter.Repositories.messageRepository;
    this.Isub = this.adapter.Repositories.subRepo;
    this.bucket = this.adapter.getBucket();
  }
  //#region Read Operations
  /**
   * @ReadOperations => Segmento de Operaciones de  Lectura
   */
  public findAllAsync = async ({ filter = '' }): Promise<Array<GroupDto>> => {
    try {
      const groups = (await this.groupsRepository.getAllAsync(filter)) ?? null;
      const foundGroups = await Promise.all(
        groups.map(async (g) => {
          const users = await this.Iuser.getUsersByUids(g.users);
          const owner = await this.Iuser.getUserbyId(g.author);
          return GroupDto.GroupInstance(
            g,
            users.map((user: User) =>
              UserPartialDto.Factory(plainToInstance(UserDto, user)),
            ),
            plainToInstance(UserPartialDto, owner),
          );
        }),
      );
      return foundGroups;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Este metodo devuele los grupos en lo que un usuario está intersectado
   * @param userId Identificador Unico de Usuario
   * @returns Retorna una Collection  de grupos
   */
  public findByUser = async (userId: string): Promise<Array<GroupDto>> => {
    const groups =
      (await this.groupsRepository.getIntersectedGroups(userId)) ?? null; // Aqui esta propenso a que se quiebre
    const groupCollection = await groups.reduce(async (acc, g) => {
      const groupsAccumulator = await acc;
      const messages = await this.messageRepository.getByGroups(g.id);
      if (messages.length === 0) {
        g.lastMessage = 'Aún no hay mensajes';
        g.modifiedDate = Time.getCustomDate(new Date());
      } else {
        g.lastMessage = `${messages[0].nickName}: ${messages[0].messageContent}`;
        g.modifiedDate = Time.getCustomDate(
          new Date(messages[0].timeDecorator),
          'T',
        );
      }
      groupsAccumulator.push(g);
      return groupsAccumulator;
    }, Promise.resolve(new Array<GroupDto>()));
    return groupCollection;
  };

  /**
   * Este metodo devuelve un grupo a partir del identificador unico del usuario
   * @param uid el identificador unico de los grupos
   * @returns retorna una promesa de los grupos con usuarios
   */
  public findOneAsync = async (uid: string): Promise<GroupDto> => {
    const group = await this.groupsRepository.getById(uid);
    const creator = UserPartialDto.Factory(
      await this.Iuser.getUserbyId(group.author),
    );
    const users = await this.Iuser.getAllAsync();
    const partialUsers = new Array<UserPartialDto>();
    group.users.forEach((u) => {
      const currentIndex = users.findIndex((x) => x.uid == u);
      if (users[currentIndex] != undefined)
        partialUsers.push(UserPartialDto.Factory(users[currentIndex]));
    });
    const groupDto = GroupDto.GroupInstance(group, partialUsers, creator);
    return groupDto;
  };
  /** get mix of user joined */
  public finJoinedUsers = async (id: string): Promise<UserJoined[]> => {
    const group = await this.groupsRepository.getById(id);
    const uidSet = new Set();
    const freeUsers = await Promise.all(
      (
        await this.Isub.getSubscriptionsDetail('groupId', group.id)
      ).map(async (sub) => {
        const freeUser = await this.Iuser.getUserbyId(sub.beneficiaryId);
        if (freeUser != null) {
          uidSet.add(freeUser.uid);
          return new UserJoined(
            freeUser.uid,
            freeUser.nickName,
            freeUser.profilePic,
            joinType.FREE,
            freeUser.onlineStatus,
          );
        }
      }),
    );
    const premiumUsers = await Promise.all(
      group.users.map(async (uid) => {
        if (!uidSet.has(uid)) {
          const premiumUser = await this.Iuser.getUserbyId(uid);
          return new UserJoined(
            uid,
            premiumUser.nickName,
            premiumUser.profilePic,
            joinType.PRE,
            premiumUser.onlineStatus,
          );
        }
      }),
    );
    const users = [...premiumUsers, ...freeUsers];
    return users.filter((u) => u != null);
  };
  // /**
  //  *
  //  */
  // public setGroupSettings = async (
  //   payload: UpsertSettingsDto,
  // ): Promise<GroupSettings> => {
  //   const foundGroup = await this.groupsRepository.getById(payload.groupId);
  //   const foundSettings = await foundGroup.groupSettings
  //     .whereEqualTo((s) => s.userId, payload.user)
  //     .findOne();
  //   if (foundSettings != undefined) {
  //     foundSettings.isNotify = payload.isNotify ?? foundSettings.isNotify;
  //     await foundGroup.groupSettings.update(foundSettings);
  //     return foundSettings;
  //   }
  //   const inserted = await foundGroup.groupSettings.create(
  //     plainToInstance(GroupSettings, payload),
  //   );
  //   return inserted;
  // };
  /**
   *
   * @param file Archivo multimedia
   * @param payload Valores de Actualizacion tipo UpdateGroupDto
   * @returns
   */
  public updateGroupData = async (
    file: Express.Multer.File,
    payload: UpdateGroupDto,
  ): Promise<string> => {
    const str = await this.groupsRepository.updateGroup(
      file,
      payload,
      await this.bucket,
      this.eventEmitter,
    );
    return str;
  };
}
