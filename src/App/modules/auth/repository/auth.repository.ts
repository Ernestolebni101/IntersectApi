import { BaseFirestoreRepository, CustomRepository } from 'fireorm';

export interface IAuthRepository {
  createRol(): Promise<unknown>;
  getRole(): Promise<unknown>;
}
