import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LiveDataService } from './websocket.service';

@WebSocketGateway({ namespace: '/websocket', cors: true })
export class LiveDataGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('LiveDataGateway');

  constructor(private readonly liveDataService: LiveDataService) {}

  afterInit() {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.liveDataService.addClient(client);
  }

  handleDisconnect(client: Socket) {
    this.liveDataService.removeClient(client);
  }
}
