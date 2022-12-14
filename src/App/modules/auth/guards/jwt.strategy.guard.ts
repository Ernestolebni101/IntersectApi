import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('SECRET') readonly privateKey: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: privateKey,
    });
  }

  public async validate(payload: any) {
    return {
      id: payload.name,
      name: payload.sub,
      role: payload.role,
    };
  }
}
