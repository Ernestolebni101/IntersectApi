import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  public readonly id: string;
  @ApiProperty()
  public readonly lastName: string;
  @ApiProperty()
  public readonly phoneNumber: string;
  @ApiProperty()
  public readonly profilePic: string;
  @ApiProperty()
  public readonly email: string;
  @ApiProperty()
  public readonly nickName: string;
  @ApiProperty()
  public token: string;
  @ApiProperty()
  public readonly groups?: Array<string> = new Array<string>();
  @ApiProperty()
  public readonly uid: string;
  @ApiProperty()
  public onlineStatus: boolean;
}

export class UserPartialDto {
  @ApiProperty()
  public uid: string;
  @ApiProperty()
  public nickName: string;
  @ApiProperty()
  public profilePic: string;
  @ApiProperty()
  public token: string;
  @ApiProperty()
  public onlineStatus: boolean;

  public static Factory(user: UserDto) {
    const model = new UserPartialDto();
    model.nickName = user.nickName;
    model.profilePic = user.profilePic;
    model.token = user.token;
    model.uid = user.uid;
    model.onlineStatus = user.onlineStatus;
    return model;
  }
}
