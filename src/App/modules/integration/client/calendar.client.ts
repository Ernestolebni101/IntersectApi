import { Injectable, Scope } from '@nestjs/common';

import { google } from 'googleapis';
import { AppModule } from 'src/App/app.module';

Injectable();
export class CalendarClient {
  private googleAuth = new google.auth.JWT();
  private readonly calendar = google.calendar({ version: 'v3' });
  constructor() {
    this.initConfig();
  }
  private initConfig(): void {
    const cred = AppModule.globalCalendar.calendarAccount;
    this.googleAuth = new google.auth.JWT({
      email: cred['client_email'],
      key: cred['private_key'],
      scopes: 'https://www.googleapis.com/auth/calendar',
    });
  }
  public newEvent = async (event: Record<string, unknown>) => {
    try {
      const response = await this.calendar.events.insert({
        auth: this.googleAuth,
        calendarId: AppModule.globalCalendar.calendarId as string,
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
