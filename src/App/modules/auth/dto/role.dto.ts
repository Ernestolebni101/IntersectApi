import { PartialType } from '@nestjs/swagger';
export class createRoleDto {
  public RoleId: string;
  public RoleName: string;
  public RoleDescription: string;
  public isActive: boolean;
  public createdDate: Date;
  public createdBy: string;
  public modifiedBy: Array<Record<string, unknown>> = [];
}

export class updateRoleDto {
  public readonly RoleId: string;
  public RoleName: string;
  public RoleDescription: string;
  public isActive: boolean;
  public createdDate: Date;
  public createdBy: string;
  public modifiedBy: Record<string, unknown>;
}

export class RoleDto extends PartialType(createRoleDto) {
  constructor(plainModel: FirebaseFirestore.DocumentData) {
    super();
    this.RoleId = plainModel['RoleId'];
    this.createdBy = plainModel['createdBy'];
    this.createdDate = plainModel['createdDate'] as Date;
    this.RoleDescription = plainModel['RoleDescription'];
    this.RoleName = plainModel['RoleName'];
    this.isActive = plainModel['isActive'] as boolean;
    this.modifiedBy = plainModel['modifiedBy'];
  }
}
