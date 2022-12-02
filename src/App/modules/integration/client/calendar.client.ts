import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { AppModule } from '../../../app.module';
Injectable();
export class CalendarClient {
  public printKeys(): void {
    console.log(AppModule.globalCalendar);
  }

  public newEvent = async (
    event: Record<string, unknown>,
  ): Promise<unknown> => {
    try {
      const googleAuth = new google.auth.OAuth2({
        clientId:
          '67083479035-9u1ad7ei6t3cu38qc3vgcsjcdh4in8mc.apps.googleusercontent.com',
        clientSecret: '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',
        redirectUri: 'http://localhost:3000/integration/v1/calls/',
      });
      googleAuth.setCredentials({
        refresh_token:
          '1//04d5aV3Uy3iQlCgYIARAAGAQSNwF-L9IrGvn5oMlGBwCDbByaoVyx4ndqc61XPWwEJaiI9WycsJRRBP3E40OflXYoMrA-K4k8ZIU',
        access_token:
          'ya29.a0AeTM1id_XbUxpOLZVy5j8p7Ti2iBIjUHsVVrv83THgij1lnTWTzh34fyhkMDI2-8-ELM4aFRrvXjDq5Uvk-lTt3mS74BgDK9CO94LKbfCeQI5p4UGrul_KblFejuO2OX4MS8MgSzGwTBkgydM5Npr3si0m5OaCgYKAZUSARISFQHWtWOmhSRJhvq5Oe0Gi8AfGfpQaQ0163',
      });
      const calendar = google.calendar({ version: 'v3', auth: googleAuth });
      const response = await calendar.events.insert(
        {
          auth: googleAuth,
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
