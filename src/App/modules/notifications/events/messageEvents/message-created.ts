import { UpdateChatDto } from '../../../../modules/chats/dto/update-chat.dto';
import { UpdateGroupDto } from '../../../../modules/groups/dto/update-group.dto';
import { Time } from '../../../../../Utility/utility-time-zone';
import { CreateMessageDto } from '../../../../modules/messages/dto/create-message.dto';
import { Group } from '../../../../modules/groups/entities/group.entity';
import { UserDto } from 'src/App/modules/users/dto/read-user.dto';
/**
 *
 */
export abstract class MessageCreatedEvent {
  payloadMessage: CreateMessageDto;
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
    this.payloadMessage = payloadMessage;
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
    ) => Promise<unknown>,
  ) {
    super();
    this.payloadMessage = payloadMessage;
  }

  public async executeFunction(): Promise<unknown> {
    const upgradeModel = new UpdateGroupDto();
    upgradeModel.id = this.group.id;
    upgradeModel.flag = new Date().getTime();
    upgradeModel.modifiedDate = Time.getCustomDate(new Date(), 'T');
    upgradeModel.lastMessage = `${this.payloadMessage.nickName}: ${this.payloadMessage.messageContent}`;
    return await this.fn(undefined, upgradeModel);
  }
}
