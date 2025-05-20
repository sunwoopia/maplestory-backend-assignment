import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from './user.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'libs/auth';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async register(@Body() body: CreateUserDto) {
    const user = await this.userService.createUser(
      body.email,
      body.password,
      body.role,
    );
    return { message: '유저가 생성되었습니다.', userId: user._id };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body.email, body.password);
  }

  // 유저의 Role Update
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Patch('role/:userId')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body('role') role: 'User' | 'Operator' | 'Auditor' | 'Admin',
  ) {
    return this.userService.updateRole(userId, role);
  }
}
