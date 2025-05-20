import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class RewardDto {
  @Expose()
  readonly _id: string;

  @Expose()
  readonly userId: string;

  @Expose()
  readonly eventId: string;

  @Expose()
  readonly status: string;

  @Expose()
  readonly processedBy?: string;

  @Expose()
  readonly processedAt?: Date;

  @Expose()
  readonly reason?: string;

  @Expose()
  readonly createdAt: Date;
}

export class ApproveRewardDto {
  @IsBoolean()
  approve: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class RequestRewardDto {
  @IsString()
  eventId: string;
}
