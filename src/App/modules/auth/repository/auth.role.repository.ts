import { Inject, Injectable } from '@nestjs/common';
import {
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common/exceptions';
import { instanceToPlain } from 'class-transformer';
import {
  firestoreDb,
  FirestoreCollection,
  FIRESTORE_DB,
} from '../../../Database/index';
import { createRoleDto, RoleDto, updateRoleDto } from '../dto/role.dto';
@Injectable()
export class RoleRepository {
  private readonly roleCollection: FirestoreCollection;
  constructor(@Inject(FIRESTORE_DB) private readonly fireDb: firestoreDb) {
    this.roleCollection = this.fireDb.collection('Roles');
  }

  public async createNewRole(createRoleDto: createRoleDto): Promise<RoleDto> {
    const inserted = await this.roleCollection
      .doc(createRoleDto.RoleId)
      .create(instanceToPlain(createRoleDto));
    if (!inserted) throw new InternalServerErrorException();
    return createRoleDto;
  }
  public async updateRole(updateRoleDto: updateRoleDto): Promise<void> {
    const foundRole = await this.getRoleById(updateRoleDto.RoleId);
    foundRole.RoleDescription =
      updateRoleDto.RoleDescription ?? foundRole.RoleDescription;
    foundRole.RoleName = updateRoleDto.RoleName ?? foundRole.RoleName;
    foundRole.modifiedBy.push(updateRoleDto.modifiedBy);
    await this.roleCollection
      .doc(updateRoleDto.RoleId)
      .update(instanceToPlain(updateRoleDto));
  }

  public async getRoleById?(roleId: string): Promise<RoleDto> {
    const foundRole = (await this.roleCollection.doc(roleId).get()).data();
    return new RoleDto(foundRole);
  }
  public async getRoles(): Promise<Array<RoleDto>> {
    throw new NotImplementedException();
  }
}
