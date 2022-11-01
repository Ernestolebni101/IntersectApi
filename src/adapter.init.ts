/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';

import { RedisPropagatorService } from './App/shared/redis-propagator/redis-propagator.service';
import { SocketStateAdapter } from './App/shared/sockets/socket-state.adapter';
import { SocketStateService } from './App/shared/sockets/socket-state.service';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);

  app.useWebSocketAdapter(
    new SocketStateAdapter(app, socketStateService, redisPropagatorService),
  );

  return app;
};