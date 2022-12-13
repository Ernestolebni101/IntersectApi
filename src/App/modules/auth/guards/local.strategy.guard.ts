import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../../users/users.service';
Injectable();
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super();
  }
  async validate(uid: string): Promise<any> {
    const user = await this.userService.findOne(uid);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
