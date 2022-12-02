import { v4 as uuid } from 'uuid';
import { Time } from '../../../../Utility/utility-time-zone';

export const eventCall = {
  events: {
    summary: 'Salma Meet',
    attendees: ['ernestolebni123@gmail.com'],
    location: 'Managua',
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
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
    colorId: '11',
    eventType: 'focusTime',
    conferenceData: {
      createRequest: {
        requestId: uuid().split('-')[0],
        conferenceSolution: {
          key: {
            type: 'hangoutsMeet',
          },
          name: 'Hangouts Meet',
        },
        conferenceSolutionKey: {
          type: 'eventHangout',
        },
      },
    },
  },
};

// conferenceId: 'oref150-10',
//       createRequest: {
//         requestId: uuid(),
//         conferenceSolution: {
//           key: {
//             type: 'hangoutsMeet',
//           },
//           name: 'Hangouts Meet'
//       },
//       entryPoints: [
//         {
//           entryPointType: 'video',
//           accessCode: accessCode,
//           meetingCode: accessCode,
//           passcode: accessCode,
//           password: accessCode,
//           pin: accessCode,
//           label: 'meet.google.com/oref150-10',
//           uri: 'https://meet.google.com/oref150-10',
//         },
//       ],
//     },
