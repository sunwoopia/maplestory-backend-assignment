import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { CreateEventDto } from './event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async getEvents(status?: string): Promise<Event[]> {
    const filter = status ? { status } : {};
    return this.eventModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async createEvent(data: CreateEventDto): Promise<Event> {
    return this.eventModel.create(data);
  }
}
