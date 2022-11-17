import { Injectable, Inject } from '@nestjs/common';
import { MULTIMEDIA, MultimediaParams } from '../helpers/messages.constants';
import { plainToInstance } from 'class-transformer';
import { MultimediaDto } from '../dto/read-multimedia.dto';
import { firebaseClient, FIREBASE_APP_CLIENT } from '../../../Database/index';
@Injectable()
export class MultimediaService {
  private readonly db: FirebaseFirestore.Firestore;
  constructor(@Inject(FIREBASE_APP_CLIENT) private app: firebaseClient) {
    this.db = this.app.firestore();
  }
  public async getMultimedia(
    groupId: string,
    filter: MultimediaParams = MultimediaParams.all,
  ): Promise<MultimediaDto[]> {
    const multimediaRef = (
      await this.db.collection(MULTIMEDIA).where('groupId', '==', groupId).get()
    ).docs.map((doc) => plainToInstance(MultimediaDto, doc.data()));
    let multimediaList: Array<MultimediaDto>;
    switch (filter) {
      case MultimediaParams.all:
        return multimediaRef;
      case MultimediaParams.image:
        multimediaList = multimediaRef.filter(
          (item) =>
            item.messageType === MultimediaParams.image ||
            item.messageType === MultimediaParams.multiple,
        );
        break;
      case MultimediaParams.file:
        multimediaList = multimediaRef.filter(
          (item) => item.messageType === MultimediaParams.file,
        );
        break;
    }
    return multimediaList;
  }
}
