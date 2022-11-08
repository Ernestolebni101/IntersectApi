// import { Test, TestingModule } from '@nestjs/testing';
// import { GroupsService } from '../groups.service';
// import { UsersModule } from '../../users/users.module';
// import { MessagesModule } from '../../messages/messages.module';
// import { EventEmitterModule } from '@nestjs/event-emitter';
// import { MulterModule } from '@nestjs/platform-express';
// import * as Multer from 'multer';
// import { groupProvider } from '../providers/group.providers';
// import { GroupContext } from '../group.context';
// import { GroupHandleEvents } from '../events/handle-groups-event';
// import { WaitingListService } from '../waiting-list/waiting-list.service';
// import { WaitListEventHandlers } from '../waiting-list/events/handle-waitList-Events';
// import { AppModule } from '../../../app.module';
// import { firebaseProvider } from '../../../Database/database-providers/firebase.provider';
// import { UnitOfWorkAdapter } from 'src/App/Database/UnitOfWork/adapter.implements';
// import { UsersService } from '../../users/users.service';
// describe('GroupService', () => {
//   let service: GroupsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         EventEmitterModule.forRoot({ global: true }),
//         MulterModule.register({
//           storage: Multer.memoryStorage(),
//           limits: {
//             fileSize: 5 * 1024 * 1024,
//           },
//         }),
//       ],
//       providers: [GroupsService],
//     }).compile();

//     service = module.get<GroupsService>(GroupsService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
