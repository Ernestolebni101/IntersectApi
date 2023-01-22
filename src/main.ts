import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initAdapters } from './adapter.init';
import * as functions from 'firebase-functions';
import { GPATH, GPATHID } from './App/Database/database.constants';
import { FunctionsManagerService } from './App/Database/firebase/functionManager';
import { Logger } from 'nestjs-pino';
import * as sessions from 'express-session';
import * as passport from 'passport';
import {
  ClassSerializerInterceptor,
  NotImplementedException,
  ValidationPipe,
} from '@nestjs/common';
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
  await app.listen(process.env.PORT || 5001);
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
//TODO: MISSING OPERATION FOR PROMOTIONAL CODES
export const onSubscriptions = functions.firestore
  .document('SuscriptionDetails/{id}')
  .onWrite(async (snap, ctx) => {
    await (await fManager).onSubscriptions(snap);
  });
//#endregion
