import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getMessage(): Promise<string> {
    return Promise.resolve('Intersect API is Running in SERVER...');
  }
}
