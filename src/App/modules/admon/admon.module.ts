import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdmonController } from './controllers/admon.controller';
import { CatalogController } from './controllers/catalog.controller';
import { SuscriptionRepository } from './suscriptions/repository/suscription.repository';
import { BillingPeriodRepository } from './index';
import { SuscriptionService } from './suscriptions/suscriptions.service';

@Module({
  controllers: [AdmonController, CatalogController],
  providers: [
    SuscriptionRepository,
    UsersService,
    BillingPeriodRepository,
    SuscriptionService,
  ],
})
export class AdmonModule {}
