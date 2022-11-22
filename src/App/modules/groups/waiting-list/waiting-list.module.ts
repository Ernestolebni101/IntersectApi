import { Module } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { WaitingListController } from './waiting-list.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WaitListEventHandlers } from './events/handle-waitList-Events';
import { GroupsModule } from '../groups.module';
import { UsersModule } from '../../users/users.module';
import { NotificationService } from '../../../shared/notification';

@Module({
  imports: [GroupsModule, UsersModule],
  controllers: [WaitingListController],
  providers: [WaitingListService, WaitListEventHandlers, NotificationService],
  exports: [WaitListEventHandlers],
})
export class WaitingListModule {}
