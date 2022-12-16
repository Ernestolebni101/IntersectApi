import { Module } from '@nestjs/common';
import { AdmonController } from './admon.controller';

@Module({
  controllers: [AdmonController],
  providers: [],
})
export class AdmonModule {}
