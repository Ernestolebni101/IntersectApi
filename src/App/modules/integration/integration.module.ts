import { Module } from '@nestjs/common';
import { IntegrationController } from './integration.controller';

@Module({
  controllers: [IntegrationController],
  providers: [],
})
export class IntegrationModule {}
