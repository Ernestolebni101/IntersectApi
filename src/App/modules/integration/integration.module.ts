import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CalendarClient } from './client/calendar.client';
import { IntegrationController } from './integration.controller';

@Module({
  controllers: [IntegrationController],
  providers: [CalendarClient],
})
export class IntegrationModule {}
