import { Collection } from 'fireorm';

@Collection('MessageType')
export class MessageType {
  public id: string;
  public messageType: string;
  public meanType: string;
  public description: string;
  public isActive = true;
  public createdDate: Date = new Date();
}
