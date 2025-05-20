import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { Request, Response } from 'express';
@Injectable()
export class GatewayServerService {
  constructor(private readonly httpService: HttpService) {}

  async proxyRequest(
    path: string,
    targetEnv: string,
    req: Request,
    res: Response,
  ) {
    const baseUrl = process.env[targetEnv] || 'http://localhost:3001';
    const targetUrl = `${baseUrl}${path}`;

    const config: AxiosRequestConfig = {
      method: req.method as any,
      url: targetUrl,
      headers: { ...req.headers },
      data: req.body,
      validateStatus: () => true,
    };

    const response = await lastValueFrom(this.httpService.request(config));
    res.status(response.status).send(response.data);
  }
}
