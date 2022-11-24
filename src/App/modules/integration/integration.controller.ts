import {
  Controller,
  Get,
  Inject,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { Time } from 'src/Utility/utility-time-zone';
import { CalendarClient } from './client/calendar.client';
import { eventCall } from './events/new.meeting';

@Controller('integration/v1')
export class IntegrationController {
  constructor(private readonly calendarClient: CalendarClient) {}

  @Post('calls')
  async getUrlCalls(
    @Request() req: Request,
    @Response() res: Response,
  ): Promise<string> {
    try {
      const response = await this.calendarClient.newEvent(eventCall['events']);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
