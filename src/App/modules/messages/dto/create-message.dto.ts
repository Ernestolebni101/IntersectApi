import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { RepliedMessage } from '../entities/message.entity';

export class CreateMessageDto {
  @IsString()
  @ApiProperty()
  public messageContent: string;
  @IsString()
  @ApiProperty()
  public messageFrom: string;
  @IsString()
  @ApiProperty()
  public fromGroup: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public messageTime: string;
  @IsUrl()
  @ApiProperty()
  public mediaUrl: Array<string>;
  @IsString()
  @ApiProperty()
  public fileType: string;
  @IsString()
  @ApiProperty()
  public messageType: string;
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  public timeDecorator: number = Date.now();
  @ApiProperty()
  @IsString()
  public token: string;
  @ApiProperty()
  @IsString()
  public nickName: string;
  @ApiProperty()
  @IsUrl()
  public profilePic: string;
  @ApiProperty()
  @IsUrl()
  public messageDate: string;
  @ApiProperty()
  public repliedMessage: RepliedMessage;
}
