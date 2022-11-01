import { Collection } from 'fireorm';
@Collection('FileType')
export class fileType {
  public id: string;
  public fileType: string;
  public createdDate: Date;
  public isActive: string;
}
