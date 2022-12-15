import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthResponse } from './dto/response.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  public async logCredentials(user: any): Promise<AuthResponse> {
    const authResponse = await this.validateCredentials(user.uid, user.uid);
    if (!authResponse) {
      throw new BadRequestException();
    }
    authResponse.token = this.jwtService.sign({
      name: authResponse.uid,
      sub: authResponse.nickName,
      role: authResponse.rol,
    });
    return authResponse;
  }

  public async validateCredentials(
    uid: string,
    password: string,
  ): Promise<AuthResponse> {
    const { nickName, profilePic, email, roleId } =
      await this.userService.findOne(uid);
    const authResponse = new AuthResponse(
      uid,
      nickName,
      roleId,
      profilePic,
      email,
      '',
    );
    return authResponse;
  }
}