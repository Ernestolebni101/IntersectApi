import { Injectable, Inject } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { createAuthDto } from './index';
import { FIREBASE_APP_CLIENT, firebaseClient } from '../../Database/index';
import { UsersService } from '../users/users.service';
import { AuthResponse } from './dto/response.dto';
@Injectable()
export class AuthService {
  private readonly auth: auth.Auth;
  constructor(private readonly userService: UsersService) {}
  public async validateCredentials(
    uid: string,
    password: string,
  ): Promise<AuthResponse> {
    const { nickName, profilePic, email } = await this.userService.findOne(uid);
    const authResponse = new AuthResponse(
      uid,
      nickName,
      '',
      profilePic,
      email,
      '',
    );
    return authResponse;
  }
}
