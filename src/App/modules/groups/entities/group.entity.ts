import { Collection } from 'fireorm';
import { Time } from '../../../../Utility/utility-time-zone';
@Collection('interGroups')
export class Group {
  public id: string;
  public groupName: string;
  public createdBy?: string;
  public createdDate: string = Time.getCustomDate(new Date(), 'F'); // no modificable
  public modifiedDate: string = Time.getCustomDate(new Date(), 'T');
  public isCertified = false;
  public isActive = true;
  public users?: Array<string> = new Array<string>();
  public flag: number = new Date().getTime(); // para hacer el ordenamiento de los grupos
  public flagDate: number = new Date().getTime(); // Para mostrar la fecha en que se creó el grupo
  public groupProfile = '';
  public author: string;
  public isPrivate = false;
  public lastMessage = 'Aun no hay Mensajes...';
  public isWriting = false;
  public whosWriting = '';
  public inheritOwner = '';
  public groupSettings: Array<Record<string, unknown>> = new Array<
    Record<string, unknown>
  >();
  public groupMembers: Record<string, number> = {};
}
