import { Inject, Injectable } from '@nestjs/common';
import { messaging } from 'firebase-admin';
import { firebaseClient } from '../../Database/database-providers/firebase.provider';
import { FIREBASE_APP_CLIENT } from '../../Database/database.constants';
import { DataModel } from './events/fcmModels';

import { senderObject } from './helpers/sender.helper';

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
  /**
   * * Dispatch notification to all devices group
   */
  public async sendToDevices({
    notificationBody,
    settings = null,
    messageEvent,
    typeNotify = 1,
  }): Promise<void> {
    const dataModel =
      typeNotify == notificationType.groupNotification
        ? new DataModel(undefined, notificationBody)
        : new DataModel(notificationBody, undefined);
    const imageUrl =
      messageEvent.payloadMessage.messageType === 'image'
        ? messageEvent.payloadMessage.mediaUrl[0].toString()
        : '';
    if (typeNotify == notificationType.groupNotification) {
      await senderObject['groupNotification'](
        this.messagingService,
        settings,
        imageUrl,
        dataModel,
        messageEvent,
      );
    } else {
      await senderObject['directNotification'](
        this.messagingService,
        imageUrl,
        dataModel,
        messageEvent,
      );
    }
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

export enum notificationType {
  groupNotification = 1,
  directNotification = 2,
}
