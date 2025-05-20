import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async createUser(email: string, password: string, role: Role = 'User') {
    const hash = await bcrypt.hash(password, 10);
    return this.userModel.create({ email, hash, role });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다.');

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user._id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async updateRole(userId: string, newRole: Role) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');

    user.role = newRole;
    await user.save();
    return {
      message: '권한이 변경되었습니다.',
      userId: user._id,
      newRole: user.role,
    };
  }
}
