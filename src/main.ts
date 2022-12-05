import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initAdapters } from './adapter.init';
import * as functions from 'firebase-functions';
import { GPATH, GPATHID } from './App/Database/database.constants';
import { FunctionsManagerService } from './App/Database/firebase/functionManager';
import { User } from './App/Database/firebase/user';
import { Logger } from 'nestjs-pino';
//#region bootStrap
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  initAdapters(app);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('intersectApi');
  app.enableCors();
  await app.init();
  await app.listen(process.env.PORT || 5001);
  return app.get(FunctionsManagerService);
}
//#endregion

//#region  Entry Point
const fManager: Promise<FunctionsManagerService> = bootstrap();
//#endregion

//#region CloudFunctions include Firestore
/**
 * Elimina los duplicados de grupos
 */
export const onCreateGroup = functions.firestore
  .document(GPATHID)
  .onCreate(async (snap, context) => {
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
//#endregion

export const onMessageGroups = functions.firestore
  .document('Messages/{id}')
  .onCreate(async (snap, context) => {
    await (await fManager).onMessageMultimedia(snap);
  });

//#region Firebase Authentication
// export const AuthTracking = functions.auth.user().beforeSignIn(,)

const getUserConnections = async () => {
  const userRef = (await fManager).rDb
    .ref('/Users')
    .child('status')
    .child('vfF9uaBFowgL3OnzF0ldyD9EREx2');
  // userRef.update({ uid: 'nemnm' });
  const singleUser: User = (await userRef.get()).val();
  // const single: User = users.find(
  //   (x: any) => x.uid === 'vfF9uaBFowgL3OnzF0ldyD9EREx2',
  // );
  return singleUser;
};

const getRealtimeConnections = async () => {
  const realtimeDb = (await fManager).rDb;
  const userRef = realtimeDb.ref('/Users/').push();
  // const connectionList = (await realtimeDb.ref('.info/connected').get()).val();
  realtimeDb.ref('.info/connected').on('value', (snap) => {
    if (snap.val()) {
      //     // if we lose network then remove this user from the list
      userRef.onDisconnect().remove();
      //     // set user's online status
      console.log(` online: ${snap.val()}`);
    } else {
      //     // client has lost network
      console.log('offline');
    }
  });
};
//#endregion
const deleteFiles = async () => {
  const adminStorage = (await fManager).storage;
  await adminStorage.deleteFiles();
};
