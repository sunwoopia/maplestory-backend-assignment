import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const EventSchema = SchemaFactory.createForClass(Event);
