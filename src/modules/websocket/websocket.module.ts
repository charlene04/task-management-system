import { Module } from '@nestjs/common';
import { LiveDataGateway } from './websocket.gateway';
import { LiveDataService } from './websocket.service';

@Module({
  providers: [LiveDataGateway, LiveDataService],
  exports: [LiveDataService],
})
export class WebsocketModule {}
