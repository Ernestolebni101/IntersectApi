import { Collection } from 'fireorm';
import { Time } from '../../../../Utility/utility-time-zone';
@Collection('Messages')
export class Message {
  public id: string;
  public messageFrom: string;
  public fromGroup: string;
  /** Content of message */
  public messageContent: string;
  public mediaUrl: Array<string> = new Array<string>();
  /** Metadata */
  public fileType: string;
  public messageType: string;
  /** User Data */
  public nickName: string;
  public profilePic: string;
  /** Dates */
  public messageTime: string = Time.getCustomDate(new Date(), 'T'); // => DECORADOR
  public timeDecorator: number = Date.now();
  public messageDate: string = Time.getCustomDate(new Date(), 'F');
  /** Replied Object */
  public repliedMessage: object;
}
// public messageimageUrl: string;
// public isImage: boolean; //       ZZZZZZZ
// public isFile: boolean; // ZZZZZ

export class RepliedMessage {
  constructor(public repliedUser: string, public repliedMessage: string) {}
}
