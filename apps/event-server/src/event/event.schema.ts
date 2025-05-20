import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;
export type EventStatus = 'pending' | 'active' | 'ended';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  rewardType: string;

  @Prop()
  rewardValue?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop({
    type: String,
    enum: ['pending', 'active', 'ended'], // 대기, 진행중, 종료
    default: 'pending',
  })
  status: EventStatus;

  @Prop({
    type: [
      {
        key: { type: String, required: true }, // 달성 조건의 종류 ex) 'login'
        operator: { type: String, required: true }, // 달성 조건의 연산자 ex) '>='
        value: { type: String, required: true }, // 달성 조건의 value ex) '3'
      },
    ],
    default: [],
  })
  conditions: {
    key: string;
    operator: string;
    value: string | number;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'RewardDefinition' })
  reward: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
