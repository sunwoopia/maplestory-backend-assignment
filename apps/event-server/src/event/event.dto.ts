import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsNotEmpty()
  createdBy: string;

  @IsOptional()
  @IsEnum(['pending', 'active', 'ended'])
  status?: 'pending' | 'active' | 'ended';

  @IsOptional()
  @IsArray()
  conditions?: {
    key: string;
    operator: string;
    value: string | number;
  }[];

  @IsNotEmpty()
  reward: Types.ObjectId; // ✅ 보상 정의 ID
}
