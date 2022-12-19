import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdmonController } from './admon.controller';
import { SuscriptionRepository } from './suscriptions/repository/suscription.repository';

@Module({
  controllers: [AdmonController],
  providers: [SuscriptionRepository, UsersService],
})
export class AdmonModule {}
