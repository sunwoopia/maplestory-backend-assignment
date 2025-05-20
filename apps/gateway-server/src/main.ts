import { NestFactory, Reflector } from '@nestjs/core';
import { GatewayServerModule } from './gateway-server.module';
import { JwtAuthGuard, RolesGuard } from 'libs/auth';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServerModule);
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(), new RolesGuard(reflector));

  await app.listen(process.env.port ?? 5002);
}
bootstrap();
