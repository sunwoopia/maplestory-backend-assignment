import { Controller } from '@nestjs/common';
import { AuthServerService } from './auth-server.service';

@Controller()
export class AuthServerController {
  constructor(private readonly authServerService: AuthServerService) {}
}
