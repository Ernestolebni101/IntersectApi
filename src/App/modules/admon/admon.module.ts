import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdmonController } from './controllers/admon.controller';
import { CatalogController } from './controllers/catalog.controller';
import { SubscriptionRepository } from './subscriptions/repository/subscription.repository';
import { BillingPeriodRepository } from './index';
import { SubscriptionService } from './subscriptions/subscriptions.service';

@Module({
  controllers: [AdmonController, CatalogController],
  providers: [
    SubscriptionRepository,
    UsersService,
    BillingPeriodRepository,
    SubscriptionService,
  ],
})
export class AdmonModule {}
