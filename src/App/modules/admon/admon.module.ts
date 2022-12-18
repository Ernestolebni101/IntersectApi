import { Module } from '@nestjs/common';
import { AdmonController } from './admon.controller';
import { SuscriptionRepository } from './suscriptions/repository/suscription.repository';

@Module({
  controllers: [AdmonController],
  providers: [SuscriptionRepository],
})
export class AdmonModule {}
