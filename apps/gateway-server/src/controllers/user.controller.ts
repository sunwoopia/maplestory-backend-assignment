import {
  Controller,
  Post,
  Patch,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard, RolesGuard, Roles } from 'libs/auth';
import { GatewayServerService } from '../gateway-server.service';

@Controller('auth')
export class GatewayUserController {
  constructor(private readonly gatewayServerService: GatewayServerService) {}

  @Post('/')
  async proxyRegister(@Req() req: Request, @Res() res: Response) {
    return this.gatewayServerService.proxyRequest(
      '/auth',
      'AUTH_SERVER_URL',
      req,
      res,
    );
  }

  @Post('/login')
  async proxyLogin(@Req() req: Request, @Res() res: Response) {
    return this.gatewayServerService.proxyRequest(
      '/auth/login',
      'AUTH_SERVER_URL',
      req,
      res,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Patch('role/:userId')
  async proxyUpdateUserRole(
    @Param('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.gatewayServerService.proxyRequest(
      `/auth/role/${userId}`,
      'AUTH_SERVER_URL',
      req,
      res,
    );
  }
}
