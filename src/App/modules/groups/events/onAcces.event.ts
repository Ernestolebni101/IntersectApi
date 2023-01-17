import { messaging } from 'firebase-admin/lib/messaging';
import {
  DataModel,
  FcmModel,
  GroupNotification,
} from 'src/App/shared/notification';
import { UserDto, UserPartialDto } from '../../users';
import { Group } from '../entities/group.entity';
import { messageNotification } from '../helpers/group.helper';

export class OnAccesGroup {
  public owner?: UserPartialDto;
  public applicant?: UserDto;
  private notificationMessage: string;
  private groupNotification: GroupNotification;
  constructor(public readonly group: Group, public readonly userId: string) {
    this.groupNotification = new GroupNotification(
      group.id,
      group.author,
      group.groupProfile,
      group.isPrivate,
    );
  }
  private loadNotificationMessage() {
    this.notificationMessage = messageNotification[0](
      [this.applicant.nickName, this.owner.nickName],
      this.group.groupName,
      this.group.isCertified,
    );
  }
  private observeString(position: number): string {
    if (this.notificationMessage.includes(',')) {
      return this.notificationMessage.split(',')[position];
    }
    return this.notificationMessage;
  }
  public async executeByContext(
    fn_ntf: (model: messaging.Message) => Promise<void>,
  ): Promise<void> {
    try {
      this.loadNotificationMessage();
      await fn_ntf(
        FcmModel.fcmPayload(
          this.applicant.token,
          this.group.groupName,
          '',
          this.observeString(1),
          new DataModel(null, this.groupNotification),
        ),
      );
      this.group.isCertified &&
        (await fn_ntf(
          FcmModel.fcmPayload(
            this.owner.token,
            this.group.groupName,
            '',
            this.observeString(0),
            new DataModel(null, this.groupNotification),
          ),
        ));
    } catch (error) {
      //TODO: Implementar el guardado de logs en otro espacio
    }
  }
}
