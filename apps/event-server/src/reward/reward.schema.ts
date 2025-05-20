import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

export type RewardStatus = 'Pending' | 'OnHold' | 'Approved' | 'Rejected';

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ type: Types.ObjectId, ref: 'RewardDefinition', required: true })
  rewardDefinitionId: Types.ObjectId;

  @Prop({ default: 'Pending' })
  status: RewardStatus;

  @Prop()
  processedBy?: string;

  @Prop()
  processedAt?: Date;

  @Prop()
  reason?: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
