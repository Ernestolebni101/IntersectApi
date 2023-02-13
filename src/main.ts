import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initAdapters } from './adapter.init';
import * as functions from 'firebase-functions';
import { GPATH, GPATHID } from './App/Database/database.constants';
import { FunctionsManagerService } from './App/Database/firebase/functionManager';
import { Logger } from 'nestjs-pino';
import * as sessions from 'express-session';
import * as passport from 'passport';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as moment from 'moment';
import { Time } from './Utility/utility-time-zone';
//#region bootStrap
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  initAdapters(app);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('intersectApi');
  app.enableCors();
  app.use(
    sessions({
      name: 'SIGA_SESSION_ID',
      secret: AppModule.secretKey,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.init();
  await app.listen(process.env.PORT || 8080);
  return app.get(FunctionsManagerService);
}
const fManager: Promise<FunctionsManagerService> = bootstrap();
//#endregion
//#region Firebase Functions
export const onCreateGroup = functions.firestore
  .document(GPATHID)
  .onCreate(async (snap, context) => {
    console.log(context.eventId);
    const inserted = snap.data();
    const tracker = await fManager;
    const flag = await tracker.fixDuplicates(
      GPATH,
      'groupName',
      inserted.groupName,
      inserted.id,
    );
    if (flag) {
      console.info(
        `El grupo ${inserted.groupName} ya estaba creado, por ende, se ha eliminado`,
      );
    }
    console.info(
      `El grupo ${inserted.groupName} ha sido creado exitosamente!!`,
    );
  });
export const onMessageGroups = functions.firestore
  .document('Messages/{id}')
  .onCreate(async (snap, context) => {
    console.log(context.eventId);
    await (await fManager).onMessageMultimedia(snap);
  });

export const onNewSubscription = functions.firestore
  .document('SuscriptionDetails/{id}')
  .onCreate(async (snap, ctx) => {
    console.log(ctx.eventType);
    await (await fManager).onCreateSubscription(snap.data());
  });

export const onUpdateSubscriptions = functions.firestore
  .document('SuscriptionDetails/{id}')
  .onUpdate(async (snap, ctx) => {
    console.log(ctx.eventType);
    await (await fManager).onUpdateSubscription(snap.after.data());
  });
//#endregion firebase deploy --only functions:onNewSubscription
//#region pipe
// const pipeMembers = async (groupId: string): Promise<void> => {
//   const unitOfWork = (await fManager).unitOfWork;
//   const group = await unitOfWork.Repositories.groupsRepository.getById(groupId);
//   const subList = await unitOfWork.Repositories.subDetailRepo.getByParam(
//     plainToInstance(getDetail, {
//       value: groupId,
//       fieldName: 'groupId',
//       status: status.ACTIVE,
//     }),
//   );
//   const subHash = Descriptor.toHashMap(
//     subList.flatMap((sub) => sub.subscription),
//     'userId',
//   ) as Record<string, Subscription>;
//   const detailHash = Descriptor.toHashMap(subList, 'subscriptionId') as Record<
//     string,
//     SubscriptionDetail
//   >;
//   group.users
//     .filter((uid) => uid != group.author)
//     .forEach((uid) => {
//       const member = subHash[uid];
//       if (member != undefined) {
//         const detail = detailHash[member.subscriptionId];
//         group.groupMembers[member.userId] = detail.subscriptionType;
//       } else {
//         group.groupMembers[uid] = subscriptionType.FREE;
//       }
//     });
//   await unitOfWork.Repositories.groupsRepository.update(group);
// };
//#endregion

const date = moment('2023-02-02');
console.log(date.startOf('months').valueOf());
console.log(date.add(5, 'days').endOf('months').valueOf());
console.log(
  Time.daysBetween({
    startDate: new Date(date.startOf('month').valueOf()),
    endDate: new Date(date.add(5, 'days').endOf('month').valueOf()),
  }),
);
