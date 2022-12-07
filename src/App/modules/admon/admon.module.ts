import { Module } from '@nestjs/common';
import { AdmonService } from './admon.service';
import { AdmonController } from './admon.controller';

@Module({
  controllers: [AdmonController],
  providers: [AdmonService],
})
export class AdmonModule {}
