import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CalendarClient } from './client/calendar.client';
import { IntegrationController } from './integration.controller';
import { MeetClient } from './client/meet.client';
@Module({
  imports: [HttpModule],
  controllers: [IntegrationController],
  providers: [CalendarClient, MeetClient],
})
export class IntegrationModule {}
