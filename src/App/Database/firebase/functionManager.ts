import { Inject, Injectable, Scope } from '@nestjs/common';
import { firebaseClient } from '../database-providers/firebase.provider';
import { FIREBASE_APP_CLIENT } from '../database.constants';
import { Group } from '../../modules/groups/entities/group.entity';
import { plainToInstance } from 'class-transformer';
import { database } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { User } from '../../modules/users/entities/user.entity';
import { Bucket } from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import { MutimediaRepository } from '../../modules/messages/repository/multimedia.repository';
import { UnitOfWorkAdapter } from '../UnitOfWork/adapter.implements';
import {
  status,
  subscriptionType,
} from 'src/App/modules/admon/catalogs/states/entities/create-state.entities';

@Injectable()
export class FunctionsManagerService {
  public readonly db: FirebaseFirestore.Firestore;
  public readonly rDb: database.Database;
  public readonly storage: Bucket;
  constructor(
    @Inject(FIREBASE_APP_CLIENT) private readonly app: firebaseClient,
    private readonly config: ConfigService,
    private readonly unitOfWork: UnitOfWorkAdapter,
  ) {
    this.db = this.app.firestore();
    this.storage = this.app
      .storage()
      .bucket(this.config.get<string>('BUCKET_URL'));
    this.rDb = this.app.database(this.config.get<string>('REALTIME_DB'));
  }
  /**
   *
   * @param collection Coleccion a la que se va afectar
   * @param searchParam parametros de busqueda
   * @param docId id del documento
   * @returns boolean
   */
  public fixDuplicates = async (
    collection: string,
    fieldName: string,
    searchParam: string,
    docId: string,
  ): Promise<boolean> => {
    let flag = false;
    const dbCollection = this.db.collection(collection);
    const docs = (
      await dbCollection.where(fieldName, '==', searchParam).get()
    ).docs.map((doc) => plainToInstance(Group, doc.data()));
    if (docs.length > 1) {
      await dbCollection.doc(docId).delete();
      flag = true; // hay duplicados se procede a eliminar
    } else flag = false; // nop hay duplicados
    return flag;
  };

  public retrieveByUid = async (uid: string): Promise<User> => {
    const dbCollection = this.db.collection('Users');
    const user: User = (await dbCollection.where('uid', '==', uid).get()).docs
      .map((doc) => plainToInstance(User, doc.data()))
      .find((u) => u.uid === uid);
    return user;
  };

  public deleteAlldocs = async (path: string) => {
    const batch = this.db.batch();
    (await this.db.collection(path).listDocuments()).map((doc) => {
      batch.delete(doc);
    });
    batch.commit();
  };

  public onDisconnect = async (uid: string) => {
    const user = await this.retrieveByUid(uid);
    const userRef = this.db.collection('Users').doc(user.id);
    await userRef.update({ onlineStatus: false });
    delete user.email,
      delete user.profilePic,
      console.log(`${JSON.stringify(user)} se ha desconectado`);
  };

  public onMessageMultimedia = async (snapshot: any) => {
    try {
      functions.logger.info(`the snapshot structure is ${snapshot}`);
      snapshot.data().timeDecorator = Date.now();
      const repositorie = new MutimediaRepository();
      const message = await repositorie.insertMultimedia(snapshot);
      functions.logger.info(message);
    } catch (error) {
      functions.logger.error(error);
    }
  };
  public onCreateSubscription = async (snap: any) => {
    const group = await this.unitOfWork.Repositories.groupsRepository.getById(
      snap.groupId,
    );
    const subHead = (
      await this.db.collection('Suscriptions').doc(snap.subscriptionId).get()
    ).data();
    group.groupMembers.set(subHead.userId, subscriptionType.PREM);
  };

  public onUpdateSubscription = async (snap: any) => {
    const group = await this.unitOfWork.Repositories.groupsRepository.getById(
      snap.groupId,
    );
    const { subscription, beneficiaryId, subscriptionStatus } =
      await this.unitOfWork.Repositories.subDetailRepo.getById(
        snap.subscriptionDetailId,
      );
    const { userId } = subscription;
    switch (subscriptionStatus) {
      case status.EXPIRED:
        if (beneficiaryId != null) {
          group.users = group.users.filter((uid) => uid != beneficiaryId);
          group.groupMembers.delete(beneficiaryId); // for subscriptors read in group service
        }
        group.users = group.users.filter((uid) => uid != userId);
        group.groupMembers.delete(userId);
        break;
      case status.ACTIVE:
        if (beneficiaryId != null) {
          group.groupMembers.set(beneficiaryId, subscriptionType.FREE);
        }
        group.groupMembers.set(userId, subscriptionType.PREM);
        break;
    }
    await this.unitOfWork.Repositories.groupsRepository.update(group);
  };
}
