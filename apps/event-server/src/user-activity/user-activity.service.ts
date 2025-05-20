import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserActivity, UserActivityDocument } from './user-activity.shema';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectModel(UserActivity.name)
    private userActivityModel: Model<UserActivityDocument>,
  ) {}

  async ensureActivity(userId: string) {
    return this.userActivityModel.updateOne(
      { userId },
      { $setOnInsert: { userId, metrics: {} } },
      { upsert: true },
    );
  }

  async increment(userId: string, metricKey: string, amount = 1) {
    await this.ensureActivity(userId);
    await this.userActivityModel.updateOne(
      { userId },
      { $inc: { [`metrics.${metricKey}`]: amount } },
    );
  }

  async set(userId: string, metricKey: string, value: any) {
    await this.ensureActivity(userId);
    await this.userActivityModel.updateOne(
      { userId },
      { $set: { [`metrics.${metricKey}`]: value } },
    );
  }

  async getMetrics(userId: string): Promise<Record<string, any>> {
    const activity = await this.userActivityModel.findOne({ userId });
    return activity?.metrics || {};
  }

  async get(userId: string, metricKey: string): Promise<any> {
    const metrics = await this.getMetrics(userId);
    return metrics[metricKey];
  }
}
