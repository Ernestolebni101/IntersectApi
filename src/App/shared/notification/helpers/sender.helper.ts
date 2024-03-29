import { messaging } from 'firebase-admin';
import { GroupSettings } from '../../../modules/groups/dto/create-group.dto';
import { DataModel, FcmModel } from '../models/fcmModels';

export const senderObject = {
  groupNotification: async (
    mSvc: messaging.Messaging,
    settings: GroupSettings[],
    imageUrl: string,
    dataModel: DataModel,
    messageEvent: GroupMessageCreated,
  ) => {
    const notifications: messaging.Message[] = messageEvent.tokens.map(
      (t: string) => {
        return FcmModel.fcmPayload(
          t,
          messageEvent.group.groupName,
          `${messageEvent.payloadMessage.nickName}:`,
          messageEvent.payloadMessage.messageContent,
          dataModel,
          imageUrl,
          messageEvent.group.groupProfile,
        );
      },
    );
    await mSvc
      .sendAll(notifications, false)
      .then(function (response) {
        console.log('Successfully sent message:', response);
      })
      .catch(function (error) {
        console.log('Error sending message:', error);
      });
  },
  directNotification: async (
    mSvc: messaging.Messaging,
    imageUrl: string,
    dataModel: DataModel,
    messageEvent: ChatMessageCreated,
  ) => {
    const mss = FcmModel.fcmPayload(
      messageEvent.user.token,
      'Mensaje Directo',
      `${messageEvent.payloadMessage.nickName}:`,
      messageEvent.payloadMessage.messageContent,
      dataModel,
      imageUrl,
      messageEvent.payloadMessage.profilePic,
    );
    await mSvc.send(mss);
  },
};
