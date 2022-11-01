import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateWaitingListDto } from './create-waiting-list.dto';

export class UpdateWaitingListDto extends PartialType(CreateWaitingListDto) {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public id: string;
}
