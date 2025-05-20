import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestSchema } from './reward.schema';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { AuthModule } from 'libs/auth';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    AuthModule,
  ],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
