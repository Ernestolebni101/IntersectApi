import { IUnitOfWorkAdapter } from '../IUnitOfWork/interfaces.unitofWork';
import { Injectable, Inject, Scope } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { UnitOfWorkRepository } from './repositories.implements';
import { FIRESTORE_DB } from '../database.constants';
import { firestoreDb } from '../database-providers/firebase.provider';
import { Bucket } from '@google-cloud/storage';
import { repo } from '../database-providers/repository.provider';

@Injectable({ scope: Scope.DEFAULT })
export class UnitOfWorkAdapter implements IUnitOfWorkAdapter {
  public _transaction: firebase.firestore.WriteBatch;
  constructor(
    @Inject(FIRESTORE_DB) private readonly db: firestoreDb,
    @Inject(repo.REPOS) public readonly Repositories: UnitOfWorkRepository,
  ) {
    this._transaction = this.db.batch();
  }
  public commitChanges = async (): Promise<void> => {
    await this._transaction.commit();
  };

  public getBucket = async (): Promise<Bucket> =>
    Promise.resolve(firebase.storage().bucket());
}
