import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestSchema } from './reward.schema';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { AuthModule } from 'libs/auth';
import { EventSchema } from '../event/event.schema';
import {
  UserActivity,
  UserActivitySchema,
} from '../user-activity/user-activity.shema';
import { RewardDefinition, RewardDefinitionSchema } from './reward-defination';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: Event.name, schema: EventSchema },
      { name: UserActivity.name, schema: UserActivitySchema },
      { name: RewardDefinition.name, schema: RewardDefinitionSchema },
    ]),
    AuthModule,
  ],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
