import { Collection } from 'fireorm';

@Collection('Users')
export class User {
  public id: string;
  public uid: string;
  public firstName: string;
  public lastName: string;
  public phoneNumber: string;
  public profilePic?: string = null;
  public email: string;
  public nickName: string;
  public token: string;
  public password: string;
  public onlineStatus = false;
  public groups: Array<string> = new Array<string>();
}
