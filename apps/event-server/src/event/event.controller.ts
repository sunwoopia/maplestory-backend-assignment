import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'libs/auth';
import { CreateEventDto } from './event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getEventList(@Query('status') status: string) {
    return this.eventService.getEvents(status);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: CreateEventDto) {
    const event = await this.eventService.createEvent({
      ...body,
      createdBy: req.user.userId,
    });
    return {
      message: '이벤트가 생성되었습니다.',
      event: event,
    };
  }
}
