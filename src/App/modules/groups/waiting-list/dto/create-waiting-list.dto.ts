import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateWaitingListDto {
  constructor(data: any) {
    this.userId = data.uid;
    this.groupId = data.id;
    this.isBanned = data.isBanned;
    this.isAccepted = data.isAccepted;
    this.isNotified = true;
  }
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public userId: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public groupId: string;
  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty()
  public isAccepted: boolean = null;
  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty()
  public isBanned = false;
  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty()
  public isNotified = true;
}
