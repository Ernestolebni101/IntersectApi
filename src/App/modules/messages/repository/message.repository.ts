import { BaseFirestoreRepository, CustomRepository } from 'fireorm';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageDto, newMessageDto } from '../dto/read-message.dto';
import { Message } from '../entities/message.entity';
import { Bucket } from '@google-cloud/storage';
import { plainToClass } from 'class-transformer';
import { File } from '../../../../Utility/utility-createFile';

export interface IMessageRepository {
  addMessage(
    file: any,
    payload: CreateMessageDto,
    bucket: Bucket,
  ): Promise<MessageDto>;
  saveMessages(
    files: Array<Express.Multer.File>,
    payload: CreateMessageDto,
    bucket: Bucket,
  ): Promise<newMessageDto>;
  getByGroups(groupId: string): Promise<Message[]>;
  deleteMessages(id: string): Promise<void>;
}

@CustomRepository(Message)
export class MessageRepository
  extends BaseFirestoreRepository<Message>
  implements IMessageRepository
{
  public async saveMessages(
    files: Array<Express.Multer.File>,
    payload: CreateMessageDto,
    bucket: Bucket,
  ): Promise<newMessageDto> {
    return new Promise(async (resolve) => {
      if (files == undefined) {
        const model = await this.create(plainToClass(Message, payload));
        resolve(plainToClass(newMessageDto, model));
      } else {
        payload.mediaUrl = await File.uploadFile(files, bucket);
        const model = await this.create(plainToClass(Message, payload));
        resolve(plainToClass(newMessageDto, model));
      }
    });
  }
  /**
   * TODO validar el contenido con inteligencia artificial para las imagenes
   * @param file Archivo que se quiere insertar en el bucker
   * @param payload Carga del mensaje
   * @param bucket Bucket del storage
   */
  public addMessage = async (
    file: any,
    payload: CreateMessageDto,
    bucket: Bucket,
  ): Promise<MessageDto> => {
    return new Promise(async (resolve) => {
      if (!file) {
        const model = await this.create(plainToClass(Message, payload));
        resolve(plainToClass(MessageDto, model));
      } else {
        //payload.mediaUrl = await File.submitFile(file, bucket);
        const model = await this.create(plainToClass(Message, payload));
        resolve(plainToClass(MessageDto, model));
      }
    });
  };
  /**
   * Devuelve los mensajes relacionado a un grupo, subgrupo o chat directo
   * @param FromId Identificador de Grupo o Chat directo
   * @returns
   */
  public getByGroups = async (FromId: string): Promise<Message[]> =>
    (await this.whereEqualTo((m) => m.fromGroup, FromId).find())
      .sort((a, b) => a.timeDecorator - b.timeDecorator)
      .reverse();

  /**
   * Este metodo realiza eliminación de mensajes por Id
   * @param id identificador del mensaje
   */
  public async deleteMessages(id: string): Promise<void> {
    await this.runTransaction(async (tran) => {
      await tran.delete(id);
      return;
    });
  }
}
