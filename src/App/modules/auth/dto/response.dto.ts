export class AuthResponse {
  constructor(
    public uid: string,
    public nickName: string,
    public rol: string,
    public profilePic: string,
    public email: string,
    public token: string,
  ) {}
}
