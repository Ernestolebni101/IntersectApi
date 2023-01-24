import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IGroupEntity } from 'src/App/shared/strategys/istrategy.interface';
import { subscriptionType } from '../../admon/catalogs/states/entities/create-state.entities';
import { Group } from '../entities/group.entity';

export class CreateGroupDto implements IGroupEntity {
  getPayload(): Group {
    return plainToInstance(Group, this);
  }
  public groupName: string;
  public createdBy: string;
  public author: string;
  public isActive: boolean;
  public isPrivate = false;
  public isWriting = false;
  public whosWriting: string;
  public groupSettings: Array<GroupSettings> = new Array<GroupSettings>();
}

export class GroupSettings {
  constructor(public userId: string, public isNotify: boolean) {}
}
