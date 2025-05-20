import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDefinitionDocument = RewardDefinition & Document;

@Schema()
export class RewardDefinition {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: 'coupon' | 'cash' | 'points' | 'item';

  @Prop()
  value: string;

  @Prop({ default: 'manual' })
  method: 'auto' | 'manual';
}

export const RewardDefinitionSchema =
  SchemaFactory.createForClass(RewardDefinition);
