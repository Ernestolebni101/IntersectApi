import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IGroupEntity,
  IGroupStrategy,
} from '../../../../shared/strategys/istrategy.interface';
import { Group } from '../.././entities/group.entity';

export const IREQUEST = Symbol('RequestingStrategy');
export class RequestingStrategy implements IGroupStrategy {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  public async Execute<TModel extends IGroupEntity>(
    model: TModel,
    group: Group,
  ): Promise<any> {
    await this.eventEmitter.emitAsync(
      'onRequestToJoin',
      model.getPayload().createdBy,
      group.id,
    );
  }
}
