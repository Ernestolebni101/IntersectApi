import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('USERS') private readonly userService: UsersService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles) return true;
    const request = ctx.switchToHttp().getRequest();
    try {
      const user = request.user;
      const hasPermissions = roles.some((role) => user.role.RoleId == role);
      return hasPermissions;
    } catch (error) {
      const foundUser = await this.userService.findOne(request.body['uid']);
      return roles.some((role) => foundUser.roleId == role);
    }
  }
}
