import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIn, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type Role = 'User' | 'Operator' | 'Auditor' | 'Admin';

export type UserDocument = User & Document;

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
