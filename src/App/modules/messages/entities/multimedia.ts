import { plainToInstance } from 'class-transformer';
import { Collection } from 'fireorm';
import { Message } from './message.entity';
@Collection('Multimedia')
export class Multimedia {
  public id: string;
  public groupId: string;
  public messageId: string;
  public fileType: string; // tipo de archivo
  public messageType: string;
  public mediaUrl: Array<string> = []; // Url del archivo
  public messageFrom: string; // id de la persona que envió
  public sendDate: string; // Fecha de envio formatead
  public messageContent: string;
  public timeDecorator: number;
}

export class createMultimediaDto {
  public groupId: string;
  public messageId: string;
  public fileType: string; // tipo de archivo
  public messageType: string;
  public mediaUrl: Array<string> = []; // Url del archivo
  public messageFrom: string; // id de la persona que envió
  public sendDate: string; // Fecha de envio formatead
  public messageContent: string;
  public timeDecorator: number;
  constructor(snapshot: unknown) {
    const mssSnap = plainToInstance(Message, snapshot);
    this.groupId = mssSnap.fromGroup;
    this.messageId = mssSnap.id;
    this.fileType = mssSnap.fileType;
    this.messageType = mssSnap.messageType;
    this.mediaUrl = mssSnap.mediaUrl;
    this.messageFrom = mssSnap.messageFrom;
    this.sendDate = mssSnap.messageDate;
    this.messageContent = mssSnap.messageContent;
    this.timeDecorator = mssSnap.timeDecorator;
  }
}
