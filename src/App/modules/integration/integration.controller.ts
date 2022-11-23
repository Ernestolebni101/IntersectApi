import { Request, Response } from 'express';
import { Controller, Get, Post } from '@nestjs/common';
import { success } from '../../../common/response';
import { CalendarClient } from './client/calendar.client';

@Controller('integration/v1')
export class IntegrationController {
  constructor(private readonly calendarCliente: CalendarClient) {}

  @Post('calls')
  async getUrlCalls(req: Request, res: Response): Promise<number> {
    try {
      const { event } = req.body;
      const response = await this.calendarCliente.newEvent(event);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
