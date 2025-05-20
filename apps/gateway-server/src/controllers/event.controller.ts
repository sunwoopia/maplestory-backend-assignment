import { Controller, Post, Req, Res, Get, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard, RolesGuard, Roles } from 'libs/auth';
import { GatewayServerService } from '../gateway-server.service';

@Controller()
export class GatewayEventsController {
  constructor(private readonly gatewayServerService: GatewayServerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  @Post('events/create')
  async proxyCreateEvent(@Req() req: Request, @Res() res: Response) {
    return this.gatewayServerService.proxyRequest(
      '/events/create',
      'EVENT_SERVER_URL',
      req,
      res,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('events/list')
  async proxyEventList(@Req() req: Request, @Res() res: Response) {
    return this.gatewayServerService.proxyRequest(
      '/events/list',
      'EVENT_SERVER_URL',
      req,
      res,
    );
  }
}
