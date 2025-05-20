import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserActivityDocument = UserActivity & Document;

@Schema({ timestamps: true })
export class UserActivity {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ type: Map, of: MongooseSchema.Types.Mixed, default: {} })
  metrics: Record<string, any>; // 달성 조건을 Metrics Map을 사용하여 유동성 있게 관리
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);
