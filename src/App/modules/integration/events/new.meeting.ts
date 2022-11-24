import { randomUUID } from 'crypto';
import { Time } from 'src/Utility/utility-time-zone';

export const eventCall = {
  events: {
    summary: 'THE MEET BRO',
    attendees: ['ernestolebni123@gmail.com'],
    description: 'This is the description.',
    start: {
      dateTime: Time.dateTimeForCalendar()['start'],
      timeZone: 'America/Managua',
    },
    end: {
      dateTime: Time.dateTimeForCalendar()['end'],
      timeZone: 'America/Managua',
    },
    reminders: {
      useDefault: 'false',
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
    conferenceData: {
      createRequest: {
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
        requestId: randomUUID(),
      },
    },
  },
};
