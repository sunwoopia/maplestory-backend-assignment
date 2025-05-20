import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

export type RewardStatus = 'Pending' | 'OnHold' | 'Approved' | 'Rejected';

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({
    type: String,
    enum: ['Pending', 'OnHold', 'Approved', 'Rejected'], // 보상요청, 임시보류, 승인, 거절
    default: 'Pending',
  })
  status: RewardStatus;

  @Prop()
  processedBy?: string;

  @Prop()
  processedAt?: Date;

  @Prop()
  reason?: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
