import { Message } from '../../messages/entities/message.entity';
import { UserDto } from '../../users/dto/read-user.dto';
import { Time } from '../../../../Utility/utility-time-zone';
import { User } from '../../users/entities/user.entity';

export class ChatDto {
  public id: string;
  public user: Array<ChatUserDto> = new Array<ChatUserDto>();
  public modifiedDate: string = Time.formatAMPM(new Date());
  public lastMessage: string;
  public static Factory(
    id: string,
    messages: Array<Message>,
    userRaw: Array<ChatUserDto>,
  ): ChatDto {
    const model = new ChatDto();
    model.id = id;
    model.user = userRaw;
    if (messages.length === 0) {
      model.lastMessage = 'Aún no hay mensajes';
      model.modifiedDate = Time.getCustomDate(new Date());
    } else {
      model.lastMessage = `${messages[0].nickName}: ${messages[0].messageContent}`;
      model.modifiedDate = Time.getCustomDate(
        new Date(messages[0].timeDecorator),
      );
    }
    return model;
  }
}

export class ChatUserDto {
  uid: string;
  nickName: string;
  profilePic: string;
  public static Factory(user: UserDto | User): ChatUserDto {
    const newObject = new ChatUserDto();
    newObject.uid = user.uid;
    newObject.profilePic = user.profilePic;
    newObject.nickName = user.nickName;
    return newObject;
  }
}
