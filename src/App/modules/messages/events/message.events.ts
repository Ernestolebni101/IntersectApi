import { EventEmitter2 } from '@nestjs/event-emitter';
import { Time } from './../../../../Utility/utility-time-zone';
import { UpdateChatDto } from '../../chats/dto/update-chat.dto';
import { UserDto } from '../../users/dto/read-user.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateGroupDto } from '../../groups/dto/update-group.dto';
import { Group } from '../../groups/entities/group.entity';
import { Bucket } from '@google-cloud/storage';
/**
 *
 */
export abstract class MessageCreatedEvent {
  abstract executeFunction(): Promise<unknown>;
}
/**
 ** this model is dispatched when a message is sending in a bidirectional chat
 */
export class ChatMessageCreated extends MessageCreatedEvent {
  constructor(
    public payloadMessage: CreateMessageDto,
    public fn: (payload: UpdateChatDto) => Promise<void>,
    public user: UserDto,
  ) {
    super();
  }
  public async executeFunction(): Promise<unknown> {
    const chatPayload = new UpdateChatDto();
    chatPayload.id = this.payloadMessage.fromGroup;
    chatPayload.flag = new Date().getTime();
    chatPayload.modifiedDate = Time.getCustomDate(new Date(), 'T');
    return await this.fn(chatPayload);
  }
}
/**
 * @class : GroupMessageCreated
 * * this model is dispatched when a message is sending in a group chat
 */
export class GroupMessageCreated extends MessageCreatedEvent {
  constructor(
    public payloadMessage: CreateMessageDto,
    public group: Group,
    public tokens: string[],
    public fn: (
      file: Express.Multer.File,
      payload: UpdateGroupDto,
      bucket: Bucket,
      eventEmitter: EventEmitter2,
    ) => Promise<unknown>,
  ) {
    super();
  }

  public async executeFunction(): Promise<unknown> {
    const upgradeModel = new UpdateGroupDto();
    upgradeModel.id = this.group.id;
    upgradeModel.flag = new Date().getTime();
    upgradeModel.modifiedDate = Time.getCustomDate(new Date(), 'T');
    upgradeModel.lastMessage = `${this.payloadMessage.nickName}: ${this.payloadMessage.messageContent}`;
    return await this.fn(undefined, upgradeModel, undefined, undefined);
  }
}
