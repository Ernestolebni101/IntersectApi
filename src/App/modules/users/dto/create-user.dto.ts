import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  @ApiProperty()
  public roleId: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  public token: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  public onlineStatus: boolean;
}
