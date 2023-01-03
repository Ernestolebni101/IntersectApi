import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { RepliedMessage } from '../entities/message.entity';

export class CreateMessageDto {
  public messageContent: string;
  public messageFrom: string;
  public fromGroup: string;
  public messageTime: string;
  public mediaUrl: Array<string>;
  public fileType: string;
  public messageType: string;
  public timeDecorator: number = Date.now();
  public token: string;
  public nickName: string;
  public profilePic: string;
  public messageDate: string;
  public repliedMessage: RepliedMessage;
}
