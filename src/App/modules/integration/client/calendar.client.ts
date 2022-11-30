import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { AppModule } from '../../../app.module';
Injectable();
export class CalendarClient {
  private readonly calendar = google.calendar('v3');

  public printKeys(): void {
    console.log(AppModule.globalCalendar);
  }

  public newEvent = async (
    event: Record<string, unknown>,
  ): Promise<unknown> => {
    try {
      const cred = AppModule.globalCalendar.calendarAccount;
      const googleAuth = new google.auth.OAuth2({
        clientId: cred['clientId'],
        clientSecret: cred['clientSecret'],
        redirectUri: cred['redirectUri'],
      });
      const response = await this.calendar.events.insert(
        {
          auth: googleAuth,
          calendarId: AppModule.globalCalendar.calendarId as string,
          requestBody: event,
        },
        {
          params: {
            conferenceDataVersion: 1,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log(`Error at insertEvent --> ${error}`);
      return;
    }
  };
}
