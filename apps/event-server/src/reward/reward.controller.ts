import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { JwtAuthGuard, RolesGuard, Roles } from 'libs/auth';
import { ApproveRewardDto, RequestRewardDto } from './reward.dto';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('request')
  async requestReward(@Request() req, @Body() dto: RequestRewardDto) {
    const reward = await this.rewardService.requestReward(
      req.user.userId,
      dto.eventId,
    );
    return { message: '보상 요청이 완료되었습니다.', rewardId: reward._id };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Operator', 'Auditor')
  @Patch('approve/:id')
  async approveReward(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: ApproveRewardDto,
  ) {
    return this.rewardService.approveReward(
      id,
      req.user.userId,
      dto.approve,
      dto.reason,
    );
  }
}
