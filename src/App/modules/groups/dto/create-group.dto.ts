import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IGroupEntity } from 'src/App/shared/strategys/istrategy.interface';
import { Group } from '../entities/group.entity';

export class CreateGroupDto implements IGroupEntity {
  getPayload(): Group {
    return plainToInstance(Group, this);
  }
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public groupName: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public createdBy: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public author: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public isActive: boolean;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public isPrivate = false;
  @ApiProperty()
  @IsNotEmpty()
  public isWriting = false;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public whosWriting: string;
  @IsArray()
  @ApiProperty()
  @IsNotEmpty()
  public groupSettings: Array<GroupSettings> = new Array<GroupSettings>();
}

export class GroupSettings {
  constructor(public userId: string, public isNotify: boolean) {}
}
