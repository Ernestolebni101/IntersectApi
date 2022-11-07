import { Inject, Injectable } from '@nestjs/common';
import { messaging } from 'firebase-admin';
import { firebaseClient } from '../../Database/database-providers/firebase.provider';
import { FIREBASE_APP_CLIENT } from '../../Database/database.constants';
import { GroupSettings } from '../groups/dto/create-group.dto';
import { DataModel, FcmModel, GroupNotification } from './events/fcmModels';
import { GroupMessageCreated } from './events/messageEvents/message-created';

@Injectable()
export class NotificationsService {
  private messagingService: messaging.Messaging;
  constructor(
    @Inject(FIREBASE_APP_CLIENT) private readonly app: firebaseClient,
  ) {
    this.messagingService = app.messaging();
  }

  public async subscribeTopic(registrationToken: string, topic: string) {
    console.log(registrationToken);
    await this.messagingService
      .subscribeToTopic(registrationToken, topic)
      .then((response) =>
        console.log('Successfully subscribed to topic:', response),
      )
      .catch((error) => console.log('Error subscribing to topic:', error));
  }
  public unsubscribeFromTopic = async (
    registrationToken: string,
    topic: string,
  ) => {
    await this.messagingService
      .unsubscribeFromTopic(registrationToken, topic)
      .then((response) =>
        console.log('Successfully unsubscribed to topic:', response),
      )
      .catch((error) => console.log('Error subscribing to topic:', error));
  };

  public async sendTopic(topic: string, payload: any) {
    this.messagingService
      .sendToTopic(topic, payload, this.Options())
      .then(function (response) {
        console.log('Successfully sent message:', response);
      })
      .catch(function (error) {
        console.log('Error sending message:', error);
      });
  }

  public async sendToDevices({
    groupNotify,
    settings,
    messageGroupEvent,
  }): Promise<void> {
    const dataModel = new DataModel(undefined, groupNotify);
    const imageUrl =
      messageGroupEvent.payloadMessage.messageType === 'image'
        ? messageGroupEvent.payloadMessage.mediaUrl[0].toString()
        : '';
    const notifications: messaging.Message[] = messageGroupEvent.tokens.map(
      (t: string, idx: number) => {
        if (settings[idx].isNotify) {
          return FcmModel.fcmPayload(
            t,
            messageGroupEvent.group.groupName,
            `${messageGroupEvent.payloadMessage.nickName}:`,
            messageGroupEvent.payloadMessage.messageContent,
            dataModel,
            imageUrl,
            messageGroupEvent.group.groupProfile,
          );
        }
      },
    );
    await this.messagingService
      .sendAll(notifications, false)
      .then(function (response) {
        console.log('Successfully sent message:', response);
      })
      .catch(function (error) {
        console.log('Error sending message:', error);
      });
  }

  public async sendMessage(payload: messaging.Message) {
    await this.messagingService
      .send(payload, false)
      .then((res) => console.log('Successfully sent message:', res))
      .catch((e) => console.error('Error sending message:', e));
  }

  private Options(): any {
    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };
    return options;
  }
}
