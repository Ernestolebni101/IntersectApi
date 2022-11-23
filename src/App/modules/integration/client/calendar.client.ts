import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

Injectable();
export class CalendarClient {
  private googleAuth = new google.auth.JWT();
  private readonly calendar = google.calendar({ version: 'v3' });
  constructor(private config: ConfigService) {
    this.initConfig(config);
  }
  private initConfig(config: ConfigService): void {
    const json = config.get<string>('CALENDAR_CREDENTIALS');
    const cred = JSON.parse('{}');
    this.googleAuth = new google.auth.JWT({
      email: cred.client_email,
      key: cred.private_key,
      scopes: 'https://www.googleapis.com/auth/calendar',
    });
  }
  public newEvent = async (event: Record<string, unknown>) => {
    try {
      const response = await this.calendar.events.insert({
        auth: this.googleAuth,
        calendarId: this.config.get<string>('CALENDAR_ID'),
        requestBody: event,
      });

      if (response['status'] == 200 && response['statusText'] === 'OK') {
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(`Error at insertEvent --> ${error}`);
      return 0;
    }
  };
}
