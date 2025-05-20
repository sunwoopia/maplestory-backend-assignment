import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIn, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type Role = 'User' | 'Operator' | 'Auditor' | 'Admin';

export type UserDocument = User & Document;

// 유저에 대한 정보는 기본 정보로만 체크 (Role만 확실하게 분리)
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @IsOptional()
  @IsIn(['User', 'Operator', 'Auditor', 'Admin'])
  role?: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
