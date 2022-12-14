export class UpdateUserDto {
  public uid: string;
  public firstName: string;
  public lastName: string;
  public phoneNumber: string;
  public profilePic: string;
  public email: string;
  public nickName: string;
  public group?: string;
  public token: string;
  public onlineStatus: boolean;
  public roleId: string;
}
