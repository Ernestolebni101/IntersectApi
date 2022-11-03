import { UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from 'socket.io';
import { FunctionsManagerService } from './Database/firebase/functionManager';
import { RedisPropagatorInterceptor } from './shared/redis-propagator/redis-propagator.interceptor';
import { AuthenticatedSocket } from './shared/sockets/socket-state.adapter';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({
  transport: ['websocket'],
  cors: '*',
})
export class IntersectGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public readonly server: Server;
  constructor(private readonly dbManager: FunctionsManagerService) {}

  public handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    client.broadcast.timeout(3000);
    console.log(`User: ${client.auth.userId} is connected`);
    this.server.emit('connection', 'Succesfully connection');
  }

  @SubscribeMessage('events')
  public findAll(): Observable<any> {
    return from([1, 2, 3]).pipe(
      map((item) => {
        return { event: 'events', data: item };
      }),
    );
  }

  public async handleDisconnect(client: AuthenticatedSocket) {
    try {
      client.broadcast.disconnectSockets(true);
      await this.dbManager.onDisconnect(client.auth.userId);
    } catch (error) {
      console.error(error);
    }
  }
}
