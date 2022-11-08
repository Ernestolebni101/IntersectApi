import { Provider } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AddingStrategy,
  IaddingToken,
} from './providers.strategys/adding.strategy';
import {
  IREQUEST,
  RequestingStrategy,
} from './providers.strategys/requesting.strategy';

export const groupProvider: Provider[] = [
  {
    useClass: RequestingStrategy,
    provide: IREQUEST,
    inject: [EventEmitter2],
  },
  {
    useClass: AddingStrategy,
    provide: IaddingToken,
    inject: [EventEmitter2],
  },
];
