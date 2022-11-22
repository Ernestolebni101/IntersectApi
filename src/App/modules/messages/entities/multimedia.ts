import { Collection } from 'fireorm';

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
}
