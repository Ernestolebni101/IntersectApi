import { Module } from '@nestjs/common';
import { CalendarClient } from './client/calendar.client';
import { IntegrationController } from './integration.controller';

@Module({
  controllers: [IntegrationController],
  providers: [CalendarClient],
})
export class IntegrationModule {}
