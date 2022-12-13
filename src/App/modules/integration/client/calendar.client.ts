import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
Injectable();
export class CalendarClient {
  public newEvent = async (
    event: Record<string, unknown>,
  ): Promise<unknown> => {
    try {
      const jwt = new google.auth.JWT();
      const calendar = google.calendar({ version: 'v3', auth: jwt });
      const response = await calendar.events.insert(
        {
          auth: jwt,
          calendarId:
            '3201e80cc86a01bbcb5075f563130c60973c8a9ec9e4e67428a1c4aee51a526c@group.calendar.google.com',
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
