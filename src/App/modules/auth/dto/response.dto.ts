import { RoleDto } from './role.dto';

export class AuthResponse {
  constructor(
    public uid: string,
    public nickName: string,
    public rol: RoleDto,
    public profilePic: string,
    public email: string,
    public token: string,
  ) {}
}
