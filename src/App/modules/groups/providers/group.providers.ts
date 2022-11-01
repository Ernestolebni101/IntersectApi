import { Provider } from '@nestjs/common';
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
  },
  {
    useClass: AddingStrategy,
    provide: IaddingToken,
  },
];
