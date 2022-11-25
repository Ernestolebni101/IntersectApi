import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { AppModule } from '../../../app.module';
import { v4 as uuid } from 'uuid';
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
      const googleAuth = new google.auth.JWT({
        email: cred['client_email'],
        key: cred['private_key'],
        keyId: cred['private_key_id'],
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
        ],
      });
      const inserted = await this.calendar.events.insert({
        auth: googleAuth,
        calendarId: AppModule.globalCalendar.calendarId as string,
        requestBody: event,
        supportsAttachments: true,
        conferenceDataVersion: 1,
      });
      const response = await this.calendar.events.patch({
        auth: googleAuth,
        calendarId: AppModule.globalCalendar.calendarId as string,
        eventId: inserted.data.id,
        sendNotifications: true,
        conferenceDataVersion: 1,
        requestBody: {
          conferenceData: {
            createRequest: {
              conferenceSolutionKey: {
                type: 'http://meet.google.com',
              },
              requestId: uuid(),
            },
          },
        },
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
  };
}
