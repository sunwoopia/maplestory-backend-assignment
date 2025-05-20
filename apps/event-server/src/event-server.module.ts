import { Module } from '@nestjs/common';
import { EventServerController } from './event-server.controller';
import { EventServerService } from './event-server.service';
import { RewardModule } from './reward/reward.module';
import { EventModule } from './event/event.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RewardModule,
    EventModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [EventServerController],
  providers: [EventServerService],
})
export class EventServerModule {}
