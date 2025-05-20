import { Controller, All, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GatewayServerService } from '../gateway-server.service';

@Controller('auth')
export class GatewayAuthController {
  constructor(private readonly gatewayServerService: GatewayServerService) {}

  @All(':path')
  async proxyAuth(
    @Param('path') path: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.gatewayServerService.proxyRequest(
      `/auth/${path}`,
      'AUTH_SERVER_URL',
      req,
      res,
    );
  }
}
