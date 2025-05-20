import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard, RolesGuard, Roles } from 'libs/auth';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  @Post('create')
  async create(
    @Request() req,
    @Body() body: { title: string; description?: string; rewardType: string },
  ) {
    const event = await this.eventService.createEvent({
      ...body,
      createdBy: req.user.userId,
    });
    return { message: '이벤트가 생성되었습니다.', eventId: event._id };
  }
}
