import { messaging } from 'firebase-admin';
import { Injectable, Inject } from '@nestjs/common';
import { FIREBASE_APP_CLIENT } from '../../../Database/database.constants';
import { firebaseClient } from '../../../Database/database-providers/firebase.provider';

@Injectable()
export class Notification {
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

  public async sendToDevices(payload: messaging.Message[]): Promise<void> {
    await this.messagingService
      .sendAll(payload, false)
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
