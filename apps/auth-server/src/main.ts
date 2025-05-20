import { NestFactory } from '@nestjs/core';
import { AuthServerModule } from './auth-server.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServerModule);
  await app.listen(process.env.port ?? 5001);
}
bootstrap();
