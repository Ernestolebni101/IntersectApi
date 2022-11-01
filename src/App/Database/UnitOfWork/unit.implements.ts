import { Injectable } from '@nestjs/common';
import {
  IUnitOfWork,
  IUnitOfWorkAdapter,
} from '../IUnitOfWork/interfaces.unitofWork';
import { UnitOfWorkAdapter } from './adapter.implements';

@Injectable()
export class UnitOfWorkFirestore implements IUnitOfWork {
  constructor(private readonly adapter: UnitOfWorkAdapter) {}
  public create = (): IUnitOfWorkAdapter => this.adapter;
}
