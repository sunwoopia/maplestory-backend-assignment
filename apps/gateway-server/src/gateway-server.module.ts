import { Module } from '@nestjs/common';
import { GatewayServerService } from './gateway-server.service';
import { GatewayAuthController } from './controllers/auth.controller';
import { GatewayEventsController } from './controllers/event.controller';
import { GatewayRewardsController } from './controllers/reward.controller';
import { GatewayUserController } from './controllers/user.controller';

@Module({
  imports: [],
  controllers: [
    GatewayAuthController,
    GatewayEventsController,
    GatewayRewardsController,
    GatewayUserController,
  ],
  providers: [GatewayServerService],
})
export class GatewayServerModule {}
