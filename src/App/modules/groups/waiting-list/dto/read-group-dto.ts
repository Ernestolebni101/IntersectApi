import { ApiProperty } from '@nestjs/swagger';
import { UserPartialDto } from 'src/App/modules/users/dto/read-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { WaitingList } from '../entities/waiting-list.entity';

export class WaitingListDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public id: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public groupId: string;
  @ApiProperty()
  @IsNotEmpty()
  public user: UserPartialDto;
  @ApiProperty()
  @IsNotEmpty()
  public requestedTime: string;
  @ApiProperty()
  @IsNotEmpty()
  public isBanned: boolean;
  @ApiProperty()
  @IsNotEmpty()
  public isAccepted: boolean = null;
  public static Factory = (entrie: WaitingList): WaitingListDto => {
    const waitingList = new WaitingListDto();
    waitingList.groupId = entrie.groupId;
    waitingList.id = entrie.id;
    waitingList.requestedTime = entrie.requestedTime;
    waitingList.isBanned = entrie.isBanned;
    waitingList.isAccepted = entrie.isAccepted;
    waitingList.user = new UserPartialDto();
    return waitingList;
  };
}
