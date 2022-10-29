import { Injectable, Inject } from '@nestjs/common';
import { MULTIMEDIA, MultimediaParams } from '../constants/messages.constants';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { MultimediaDto } from '../dto/read-multimedia.dto';
import { Message } from '../entities/message.entity';
import { Multimedia } from '../entities/multimedia';
import { UnitOfWorkAdapter } from 'src/App/Database/UnitOfWork/adapter.implements';
import { FIREBASE_APP_CLIENT } from 'src/App/Database/database.constants';
import { firebaseClient } from 'src/App/Database/database-providers/firebase.provider';

@Injectable()
export class MultimediaService {
  private readonly db: FirebaseFirestore.Firestore;
  constructor(
    @Inject(FIREBASE_APP_CLIENT) private app: firebaseClient,
    private readonly serviceUnit: UnitOfWorkAdapter,
  ) {
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
          (item) => item.messageType === MultimediaParams.image,
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
  public insertMultimedia = async (snapshot: any) => {
    const multimediaRef = this.db.collection(MULTIMEDIA);
    const messagePayload = plainToInstance(Message, snapshot.data());
    if (messagePayload.mediaUrl.length > 0) {
      const user =
        await this.serviceUnit.Repositories.userRepository.getUserbyId(
          messagePayload.messageFrom,
        );
      const multimediaData = instanceToPlain(
        new Multimedia(
          messagePayload.fromGroup,
          messagePayload.id,
          messagePayload.fileType,
          messagePayload.messageType,
          messagePayload.mediaUrl,
          user.nickName,
          messagePayload.messageDate,
          messagePayload.messageContent,
        ),
      );
      await multimediaRef.add(multimediaData);
    } else throw new Error('No tiene contenido multimedia');
  };
}
