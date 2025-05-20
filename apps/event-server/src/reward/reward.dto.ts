import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
