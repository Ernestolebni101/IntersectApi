import { Collection } from 'fireorm';

@Collection('Users')
export class User {
  public id: string;
  public uid: string;
  public firstName: string;
  public lastName: string;
  public profilePic?: string = null;
  public email: string;
  public nickName: string;
  public token: string;
  public onlineStatus = false;
  public customerRecords: Record<string, unknown>;
}
