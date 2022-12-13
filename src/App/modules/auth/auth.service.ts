import { Injectable, Inject } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { createAuthDto } from './index';
import { FIREBASE_APP_CLIENT, firebaseClient } from '../../Database/index';
import { UsersService } from '../users/users.service';
import { AuthResponse } from './dto/response.dto';
@Injectable()
export class AuthService {
  private readonly auth: auth.Auth;
  constructor(
    @Inject(FIREBASE_APP_CLIENT) private readonly app: firebaseClient,
    private readonly userService: UsersService,
  ) {
    this.auth = this.app.auth();
  }
  public async Identity(payload: createAuthDto): Promise<AuthResponse> {
    const { uid, nickName, profilePic, email } = await this.userService.findOne(
      payload.uid,
    );
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
