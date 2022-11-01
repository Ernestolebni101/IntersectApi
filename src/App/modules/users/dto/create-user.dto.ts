import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  registerSchema,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public uid: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public firstName: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public lastName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public phoneNumber: string;
  @IsString()
  @ApiProperty()
  public profilePic?: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  public email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public nickName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public password: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public token: string;
  public onlineStatus: boolean;
}
