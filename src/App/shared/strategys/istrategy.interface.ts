import { CreateGroupDto } from 'src/App/modules/groups/dto/create-group.dto';
import { Group } from '../../modules/groups/entities/group.entity';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IGroupEntity {
  getPayload(): Group;
}
export interface IUserEntity {}
export interface IMessageEntity {}
export interface IStrategy {
  groupOperation<TModel extends IGroupEntity>(model: TModel): Promise<any>;
  userOperation<TModel extends IUserEntity>(model: TModel): Promise<any>;
  messagesOperation<TModel extends IMessageEntity>(model: TModel): Promise<any>;
}

export interface IGroupStrategy {
  Execute<TModel extends CreateGroupDto>(
    model: TModel,
    group: Group,
  ): Promise<any>;
}
