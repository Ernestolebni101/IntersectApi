import { HttpService } from '@nestjs/axios';
import { Controller, Post, Request, Response } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { success } from 'src/common/response';
import { CalendarClient } from './client/calendar.client';
import { eventCall } from './events/new.meeting';

@Controller('integration/v1')
export class IntegrationController {
  constructor(
    private readonly calendarClient: CalendarClient,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  @Post('calls')
  async getUrlCalls(@Request() req, @Response() res): Promise<unknown> {
    try {
      const response = await this.calendarClient.newEvent(eventCall['events']);
      return success(req, res, response, 200);
    } catch (error) {
      console.error(error);
    }
  }
  @Post('callEvent')
  async createCallEvent(@Request() req, @Response() res) {
    try {
      const URL = `${this.config.get<string>('URL')}${this.config.get<string>(
        'CALENDAR_ID',
      )}/events?conferenceDataVersion=1`;
      const response = this.httpService.post(URL, {
        body: eventCall['events'],
        headers: {
          Authorization: `Bearer ${this.config.get<string>('ACCESS')}`,
        },
      });
      return success(req, res, response);
    } catch (error) {}
  }
}
