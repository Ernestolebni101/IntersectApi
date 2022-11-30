import { Module } from '@nestjs/common';
import { CalendarClient } from './client/calendar.client';
import { IntegrationController } from './integration.controller';
import { MeetClient } from './client/meet.client';
@Module({
  controllers: [IntegrationController],
  providers: [CalendarClient, MeetClient],
})
export class IntegrationModule {}
