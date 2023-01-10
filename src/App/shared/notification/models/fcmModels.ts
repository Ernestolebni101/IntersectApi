import { messaging } from 'firebase-admin';

export class FcmModel {
  protected data: DataModel;
  public static fcmPayload(
    tokenId: string,
    title: string,
    sender: string,
    mss: string,
    data: DataModel,
    url = '',
    icon = 'https://s.hipertextual.com/wp-content/uploads/2019/07/hipertextual-llegaron-chicos-malos-the-boys-garth-ennis-llega-viernes-amazon-prime-2019678019.jpg',
  ): messaging.Message {
    const body = `${sender} ${mss}`;
    const message: messaging.Message = {
      token: tokenId,
      android: {
        priority: 'high',
        notification: {
          title: title,
          priority: 'high',
          body: body,
          channelId: 'intersect',
          visibility: 'public',
          defaultVibrateTimings: true,
          eventTimestamp: new Date(),
          vibrateTimingsMillis: [1000, 2000],
          localOnly: false,
          icon: icon,
        },
        data: {
          notificationData: validateNotification(data),
        },
      },
    };
    if (url !== '') {
      message.android.notification.imageUrl = url;
    }
    return message;
  }
}

export class DataModel {
  constructor(
    public directNotification: DirectNotification,
    public groupNotification: GroupNotification,
  ) {}
}

export class DirectNotification {
  constructor(public Id: string, public user: Array<Record<string, unknown>>) {}
}

export class GroupNotification {
  constructor(
    public id: string,
    public author: string,
    public groupProfile: string,
    public isPrivate: boolean,
    public groupName?: string,
    public isActive?: boolean,
  ) {}
}

const validateNotification = (data: DataModel): string => {
  if (data.directNotification != null) {
    return JSON.stringify({
      notificationData: data.directNotification,
      notificationType: enumNotification.isDirectChat,
    });
  }
  if (data.groupNotification != null) {
    return JSON.stringify({
      notificationData: data.groupNotification,
      notificationType: enumNotification.isGroup,
    });
  }
};

enum enumNotification {
  isGroup = '1',
  isDirectChat = '2',
}
