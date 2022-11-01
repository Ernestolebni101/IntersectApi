import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserPartialDto } from 'src/App/modules/users/dto/read-user.dto';
import { IGroupEntity } from 'src/App/shared/strategys/istrategy.interface';
import { Time } from 'src/Utility/utility-time-zone';
import { Group } from '../entities/group.entity';
import { GroupSettings } from './create-group.dto';

export class GroupDto implements IGroupEntity {
  getPayload(): Group {
    return plainToInstance(Group, this);
  }
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public groupName: string;
  @ApiProperty()
  public author: UserPartialDto; // uid del usuario
  @ApiProperty()
  public createdDate: string; // => DATE WHEN GROUP HAS CREATED BY USER
  @ApiProperty()
  public modifiedDate: string;
  @ApiProperty()
  public isActive: boolean;
  @ApiProperty()
  public users: Array<UserPartialDto> = new Array<UserPartialDto>();
  @ApiProperty()
  public flag: number;
  @ApiProperty()
  public createdBy: string;
  @ApiProperty()
  public lastMessage: string;
  @ApiProperty()
  public groupProfile: string;
  @ApiProperty()
  public isPrivate: boolean;
  @ApiProperty()
  public groupSettings: Array<GroupSettings>;
  public static GroupInstance(
    group: Group,
    intersectedUsers: Array<UserPartialDto>,
    creator: UserPartialDto,
  ): GroupDto {
    const groupDto = new GroupDto();
    groupDto.author = creator;
    groupDto.createdBy = group.createdBy;
    groupDto.groupName = group.groupName;
    groupDto.createdDate = Time.getCustomDate(new Date(group.flagDate), 'F');
    groupDto.modifiedDate = Time.getCustomDate(new Date(group.flagDate));
    groupDto.flag = group.flag;
    groupDto.id = group.id;
    groupDto.isActive = group.isActive;
    groupDto.users = intersectedUsers;
    groupDto.groupProfile = group.groupProfile;
    groupDto.isPrivate = group.isPrivate;
    return groupDto;
  }
}
