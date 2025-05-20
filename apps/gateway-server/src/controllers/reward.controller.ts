import {
  Controller,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard, RolesGuard, Roles } from 'libs/auth';
import { GatewayServerService } from '../gateway-server.service';

@Controller('rewards')
export class GatewayRewardsController {
  constructor(private readonly gatewayServerService: GatewayServerService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async proxyMyRewards(@Req() req: Request, @Res() res: Response) {
    return this.gatewayServerService.proxyRequest(
      '/rewards',
      'EVENT_SERVER_URL',
      req,
      res,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('request')
  async proxyRequest(@Req() req: Request, @Res() res: Response) {
    return this.gatewayServerService.proxyRequest(
      '/rewards/request',
      'EVENT_SERVER_URL',
      req,
      res,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Operator', 'Auditor')
  @Patch('approve/:id')
  async proxyApprove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.gatewayServerService.proxyRequest(
      `/rewards/approve/${id}`,
      'EVENT_SERVER_URL',
      req,
      res,
    );
  }
}
