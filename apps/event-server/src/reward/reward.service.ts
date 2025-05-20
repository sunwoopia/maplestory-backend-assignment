import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from './reward.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardModel: Model<RewardRequestDocument>,
  ) {}

  async requestReward(userId: string, eventId: string) {
    const exists = await this.rewardModel.exists({ userId, eventId });
    if (exists) throw new BadRequestException('이미 보상 요청을 하였습니다.');
    return this.rewardModel.create({ userId, eventId });
  }

  async approveReward(
    requestId: string,
    approverId: string,
    approve: boolean,
    reason?: string,
  ) {
    const reward = await this.rewardModel.findById(requestId);
    if (!reward) throw new NotFoundException('보상 요청을 찾을 수 없습니다.');

    reward.status = approve ? 'Approved' : 'Rejected';
    reward.processedBy = approverId;
    reward.processedAt = new Date();
    if (!approve && reason) reward.reason = reason;

    await reward.save();
    return { message: '보상 요청이 처리되었습니다.', status: reward.status };
  }
}
