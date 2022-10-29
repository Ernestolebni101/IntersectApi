import { Module } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { WaitingListController } from './waiting-list.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WaitListEventHandlers } from './events/handle-waitList-Events';
import { GroupsModule } from '../groups.module';
import { UsersModule } from '../../users/users.module';
import { MessagesModule } from '../../messages/messages.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    GroupsModule,
    UsersModule,
    MessagesModule,
  ],
  controllers: [WaitingListController],
  providers: [WaitingListService, WaitListEventHandlers],
  exports: [WaitListEventHandlers],
})
export class WaitingListModule {}
