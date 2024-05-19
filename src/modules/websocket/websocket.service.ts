import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class LiveDataService {
  private readonly clients: Map<string, Socket> = new Map();

  addClient(client: Socket) {
    this.clients.set(client.id, client);
  }

  removeClient(client: Socket) {
    this.clients.delete(client.id);
  }

  streamData(data: any) {
    this.clients.forEach((client) => {
      client.emit('liveData', data);
    });
  }
}
