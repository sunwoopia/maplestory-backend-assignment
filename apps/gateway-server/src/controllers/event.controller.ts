import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard, RolesGuard, Roles } from 'libs/auth';
import { GatewayServerService } from '../gateway-server.service';

@Controller('events')
export class GatewayEventsController {
  constructor(private readonly gatewayServerService: GatewayServerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  @Post('create')
  async proxyCreate(@Req() req: Request, @Res() res: Response) {
    return this.gatewayServerService.proxyRequest(
      '/events/create',
      'EVENT_SERVER_URL',
      req,
      res,
    );
  }
}
