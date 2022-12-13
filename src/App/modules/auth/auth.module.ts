import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport/dist';
import { SessionSerializer } from './guards/serializer/session.serializer';
import { LocalAuthGuard } from './guards/localauth.guard';
import { LocalStrategy } from './guards/local.strategy.guard';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    SessionSerializer,
    LocalAuthGuard,
    LocalStrategy,
  ],
})
export class AuthModule {}
