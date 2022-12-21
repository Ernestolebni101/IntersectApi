import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport/dist';
import { SessionSerializer } from './guards/serializer/session.serializer';
import { LocalStrategy } from './guards/local.strategy.guard';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt.strategy.guard';
import { RoleRepository } from './repository/auth.role.repository';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';
@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('SECRET'),
          signOptions: { expiresIn: '3600s' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    RoleRepository,
    UsersService,
    SessionSerializer,
    RolesGuard,
    JwtAuthGuard,
    {
      provide: 'AUTH',
      useClass: AuthService,
    },
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    {
      provide: 'SECRET',
      useFactory: (configService: ConfigService): string =>
        configService.get<string>('SECRET'),
      inject: [ConfigService],
    },
  ],
  exports: [
    JwtStrategy,
    LocalStrategy,
    RolesGuard,
    JwtAuthGuard,
    LocalAuthGuard,
  ],
})
export class AuthModule {
  public static appConfigurations: Record<string, unknown> = {};
  constructor(private readonly configService: ConfigService) {
    AuthModule.appConfigurations['secret'] =
      this.configService.get<string>('SECRET');
  }
}
