import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { CreateGroupDto } from './create-group.dto';

/**
 * ! Es necesario actualizar el metodo update para los grupos.
 * TODO: Añadir un enumerable para identificar las acciones de Actualizacion
 * ! Observación: modificacion de miembros => agregar o quitar de la coleccion.
 * ! Observación: Actualizar perfil => trabajar con un bucket => requiere de una clase especifica que maneje el servicio de los buckets
 * !
 */
export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty()
  public id: string; //grupo
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public userId?: string; //usuario extra
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public groupProfile: string = null; // =>  Perfil de Grupo
  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty()
  public isActive: boolean = null; // =>  Actividad  de Grupo
  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty()
  public isPrivate: boolean = null; // =>  Privacidad  de Grupo
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public modifiedDate: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public flag: number;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public lastMessage: string;
  @ApiProperty()
  @IsNotEmpty()
  public isWriting = false;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public whosWriting: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public inherithOwner: string;
  @IsInt()
  @ApiProperty()
  @IsNotEmpty()
  public memberOption = MemberOpt.none;
  @IsInt()
  @ApiProperty()
  @IsNotEmpty()
  public isNotify: boolean;
}
/**
 * Enumerable para determinar las opciones de actualización relacionadas al owner
 * * 0 para añadir a usuario en espera
 * * 1 para remover usuarios del grupo
 * * 2 para setear privilegios de owner a otro miembro del grupo
 */
export enum MemberOpt {
  addMember = 0,
  removeMember = 1,
  setOwner = 2,
  none = 3,
  setNotificationSettings = 4,
}
// @IsBoolean()  =>  No esta en uso
// @ApiProperty()
// @IsNotEmpty()
// public isMember: boolean; // =>  para determinar si se agrega o se remueve el usuario
