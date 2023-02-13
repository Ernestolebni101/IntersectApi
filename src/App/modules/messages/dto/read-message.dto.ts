import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/read-user.dto';
export class MessageDto {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public messageContent: string;
  @ApiProperty()
  public messageFrom: UserDto;
  @ApiProperty()
  public fromGroup: string;
  @ApiProperty()
  public messageTime: string;
  @ApiProperty()
  public messageimageUrl: string;
  @ApiProperty()
  public isImage: boolean;
  @ApiProperty()
  public timeDecorator: number;
}

export class newMessageDto {
  public id: string;
  public messageFrom: string;
  public fromGroup: string;
  /** Content of message */
  public messageContent: string;
  public mediaUrl: Array<string> = new Array<string>();
  /** Metadata */
  public fileType: string;
  public messageType: string;
  /** User Data */
  public nickName: string;
  public profilePic: string;
  /** Dates */
  public messageTime: string; // => DECORADOR
  public timeDecorator: number;
  public messageDate: string;
}

export class MessageSummaryDto {
  constructor(public id: string, public messageContent: string) {}
}
