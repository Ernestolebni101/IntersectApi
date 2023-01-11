import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdmonController } from './controllers/admon.controller';
import { CatalogController } from './controllers/catalog.controller';
import { SubscriptionRepository } from './subscriptions/repository/subscription.repository';
import { BillingPeriodRepository } from './index';
import { SubscriptionService } from './subscriptions/subscriptions.service';
import { MulterModule } from '@nestjs/platform-express';
import * as Multer from 'multer';

@Module({
  controllers: [AdmonController, CatalogController],
  imports: [
    MulterModule.register({
      storage: Multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  providers: [
    SubscriptionRepository,
    UsersService,
    BillingPeriodRepository,
    SubscriptionService,
  ],
})
export class AdmonModule {}
