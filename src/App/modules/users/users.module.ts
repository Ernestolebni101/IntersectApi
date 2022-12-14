import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import * as Multer from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { AuthMiddleware } from '../../Middlewares/auth/auth.middleware';

@Module({
  imports: [
    MulterModule.register({
      storage: Multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: Logger, useValue: new Logger(UsersModule.name) },
  ],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
