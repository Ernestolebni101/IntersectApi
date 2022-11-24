import { Injectable } from '@nestjs/common';
import { calendar_v3, google } from 'googleapis';
import { AppModule } from '../../../app.module';
Injectable();
export class CalendarClient {
  private readonly calendar = google.calendar({ version: 'v3' });

  public printKeys(): void {
    console.log(AppModule.globalCalendar);
  }

  public async newEvent(event: Record<string, unknown>): Promise<unknown> {
    try {
      const cred = AppModule.globalCalendar.calendarAccount;
      const googleAuth = new google.auth.JWT({
        email: cred['client_email'],
        key: cred['private_key'],
        keyId: cred['private_key_id'],
        scopes: 'https://www.googleapis.com/auth/calendar',
      });
      const response = await this.calendar.events.insert({
        auth: googleAuth,
        calendarId: AppModule.globalCalendar.calendarId as string,
        requestBody: event,
        sendNotifications: true,
        conferenceDataVersion: 1,
      });
      // const {
      //   data: { conferenceData },
      // } = response[0];
      // const { uri } = conferenceData.entryPoints[0];
      return response;
    } catch (error) {
      console.log(`Error at insertEvent --> ${error}`);
      return;
    }
  }
}
