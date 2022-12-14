import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../index';
Injectable();
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH') private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const authResponse = await this.authService.validateCredentials(
      username,
      password,
    );
    if (!authResponse) {
      throw new UnauthorizedException();
    }
    return authResponse;
  }
}
