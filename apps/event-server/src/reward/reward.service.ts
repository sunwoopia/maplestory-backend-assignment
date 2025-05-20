import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from './reward.schema';
import { Event, EventDocument } from '../event/event.schema';
import {
  UserActivity,
  UserActivityDocument,
} from '../user-activity/user-activity.shema';
import { RewardDto } from './reward.dto';
import { plainToInstance } from 'class-transformer';
import {
  RewardDefinition,
  RewardDefinitionDocument,
} from './reward-defination';

function validateUserForEvent(
  event: Event,
  userActivity: UserActivity,
): boolean {
  return event.conditions.every((cond) => {
    const userVal = userActivity.metrics?.[cond.key];
    switch (cond.operator) {
      case '>=':
        return Number(userVal) >= Number(cond.value);
      case '>':
        return Number(userVal) > Number(cond.value);
      case '<=':
        return Number(userVal) <= Number(cond.value);
      case '<':
        return Number(userVal) < Number(cond.value);
      case '==':
        return userVal == cond.value;
      case '===':
        return userVal === cond.value;
      case '!=':
        return userVal != cond.value;
      default:
        return false;
    }
  });
}

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardModel: Model<RewardRequestDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(UserActivity.name)
    private userActivityModel: Model<UserActivityDocument>,
    @InjectModel(RewardDefinition.name)
    private rewardDefinitionModel: Model<RewardDefinitionDocument>,
  ) {}

  async requestReward(userId: string, eventId: string) {
    const exists = await this.rewardModel.exists({ userId, eventId });
    if (exists) throw new BadRequestException('이미 보상 요청을 하였습니다.');

    const event = await this.eventModel.findById(eventId).populate('reward');
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    const rewardDef = event.reward as unknown as RewardDefinitionDocument;
    if (!rewardDef) throw new BadRequestException('보상 정의가 없습니다.');

    const userActivity = await this.userActivityModel.findOne({ userId });
    if (!userActivity)
      throw new BadRequestException('유저 활동 정보가 없습니다.');

    const eligible = validateUserForEvent(event, userActivity);
    if (!eligible) {
      throw new BadRequestException('이벤트 참여 조건을 충족하지 않았습니다.');
    }

    return this.rewardModel.create({
      userId,
      eventId,
      rewardType: rewardDef.type,
      rewardValue: rewardDef.value,
    });
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

  async getUserRewards(userId: string): Promise<RewardDto[]> {
    const rewards = await this.rewardModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    return plainToInstance(RewardDto, rewards, {
      excludeExtraneousValues: true,
    });
  }

  async getRewardsByEvent(eventId: string): Promise<RewardRequest[]> {
    return this.rewardModel.find({ eventId }).sort({ createdAt: -1 }).exec();
  }
}
