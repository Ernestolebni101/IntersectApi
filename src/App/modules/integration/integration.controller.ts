import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Request, Response } from 'express';
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { success } from 'src/common/response';

@Controller('integration/v1')
export class IntegrationController {
  private readonly oauth2Client = new google.auth.OAuth2();
  constructor(private readonly config: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: this.config.get<string>('Client_ID'),
      clientSecret: this.config.get<string>('Client_Secret'),
      redirectUri: 'http://localhost:3000',
    });
  }
  @Post('/generate-tokens')
  public async generateToken(req: Request, res: Response) {
    try {
      const { code } = req.body;
      const response = await this.oauth2Client.getToken(code);
      return success(req, res, response);
    } catch (error) {}
  }
}
