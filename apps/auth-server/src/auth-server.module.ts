import { Module } from '@nestjs/common';
import { AuthServerController } from './auth-server.controller';
import { AuthServerService } from './auth-server.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
  ],
  controllers: [AuthServerController],
  providers: [AuthServerService],
})
export class AuthServerModule {}
