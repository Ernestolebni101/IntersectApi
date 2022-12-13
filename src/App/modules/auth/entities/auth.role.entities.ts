import { Collection } from 'fireorm';

@Collection('Role')
export class Role {
  public id: string;
  public RoleId: string;
  public RoleName: string;
  public RoleDescription: string;
  public isActive: boolean;
  public createdDate: Date;
  public createdBy: string;
  public modifiedBy: string;
}
