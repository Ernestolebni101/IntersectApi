import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IGroupStrategy } from '../../../../shared/strategys/istrategy.interface';
import { Group } from '../.././entities/group.entity';
import { CreateGroupDto } from '../../dto/create-group.dto';

export const IREQUEST = Symbol('RequestingStrategy');
@Injectable()
export class RequestingStrategy implements IGroupStrategy {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  public async Execute<TModel extends CreateGroupDto>(
    model: TModel,
    group: Group,
  ): Promise<any> {
    await this.eventEmitter.emitAsync('onRequestToJoin', model, group.id);
  }
}
