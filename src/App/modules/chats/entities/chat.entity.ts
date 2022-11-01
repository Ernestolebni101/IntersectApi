import { Collection } from 'fireorm';
import { Time } from '../../../../Utility/utility-time-zone';

@Collection('Chats')
export class Chat {
  public id: string;
  public createdDate: string = Time.getCustomDate(new Date());
  public modifiedDate: string = Time.getCustomDate(new Date());
  public flagDate: number = new Date().getDate();
  public flag: number = new Date().getTime();
  public users: Array<string> = new Array<string>();
}
