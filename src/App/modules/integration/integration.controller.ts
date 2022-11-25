import {
  Controller,
  Get,
  Inject,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { success } from 'src/common/response';
import { CalendarClient } from './client/calendar.client';
import { eventCall } from './events/new.meeting';

@Controller('integration/v1')
export class IntegrationController {
  constructor(private readonly calendarClient: CalendarClient) {}

  @Post('calls')
  async getUrlCalls(@Request() req, @Response() res): Promise<unknown> {
    try {
      const response = await this.calendarClient.newEvent(eventCall['events']);
      return success(req, res, response, 200);
    } catch (error) {
      console.error(error);
    }
  }
}
