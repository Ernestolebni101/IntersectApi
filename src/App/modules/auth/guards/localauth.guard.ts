import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

Injectable();
export class LocalAuthGuard extends AuthGuard('local') {
  // async canActivate(ctx: ExecutionContext) {
  //   const result = (await super.canActivate(ctx)) as boolean;
  //   const request = ctx.switchToHttp().getRequest();
  //   await super.logIn(request);
  //   return result;
  // }
}
