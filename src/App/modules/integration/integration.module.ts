import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { CalendarClient } from './client/calendar.client';
import { IntegrationController } from './integration.controller';

@Module({
  controllers: [IntegrationController],
  providers: [CalendarClient],
})
export class IntegrationModule {
  private googleCalendar = new google.auth.JWT();
}
