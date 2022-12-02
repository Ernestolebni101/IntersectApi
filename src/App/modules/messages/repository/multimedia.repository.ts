import { plainToInstance } from 'class-transformer';
import { BaseFirestoreRepository, CustomRepository } from 'fireorm';
import { MultimediaParams } from '../helpers/messages.constants';
import { createMultimediaDto, Multimedia } from '../entities/multimedia';
import { Message } from '../entities/message.entity';

export interface IMultimediaRepository {
  getMultimedia(
    groupId: string,
    filter: MultimediaParams,
  ): Promise<Multimedia[]>;
  insertMultimedia(snapshot: any): Promise<string>;
}
@CustomRepository(Multimedia)
export class MutimediaRepository
  extends BaseFirestoreRepository<Multimedia>
  implements IMultimediaRepository
{
  constructor() {
    super(Multimedia);
  }
  public async getMultimedia(
    groupId: string,
    filter: MultimediaParams,
  ): Promise<Multimedia[]> {
    throw new Error('Method not implemented.');
  }
  public async insertMultimedia(snapshot: any): Promise<string> {
    const multimedia = new createMultimediaDto(snapshot.data());
    multimedia.timeDecorator = Date.now();
    if (multimedia.mediaUrl.length > 0 || multimedia.messageType == 'video') {
      await this.create(multimedia);
      return 'Contenido multimedia agregado exitosamente';
    } else return 'El mensaje no contiene multimedia';
  }
}
