/* eslint-disable prettier/prettier */
import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import socketio from 'socket.io';

import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';

import { SocketStateService } from './socket-state.service';

interface TokenPayload {
  readonly userId: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {
    super(app);
  }

  public create(port: number, options: any) {
    const server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(server);

    server.use(async (socket: AuthenticatedSocket, next) => {
      const token =
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization;

      if (!token) {
        socket.auth = null;
        
        // not authenticated connection is still valid
        // thus no error
        return next();
      }

      try {
        socket.auth = {
          userId: (Array.isArray(token))?token[0]:token,
        };

        return next();
      } catch (e) {
        return next(e);
      }
    });

    return server; 
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        server.sockets.timeout(3000);
        this.socketStateService.
        add(socket.auth.userId, socket);

        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.auth.userId, socket);
          socket.removeAllListeners('disconnect');
        });
      }
      callback(socket);
    });
  }
}
