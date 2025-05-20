import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(data: {
    title: string;
    description?: string;
    rewardType: string;
    createdBy: string;
  }) {
    return this.eventModel.create(data);
  }
}
