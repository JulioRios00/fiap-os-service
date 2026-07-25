import { Injectable } from '@nestjs/common';
import { DomainEventPublisherPort } from '../../application/ports/domain-event-publisher.port';
import { DomainEvent } from '../../domain/events/domain-event';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OutboxEventPublisher implements DomainEventPublisherPort {
  constructor(private readonly prisma: PrismaService) {}

  async publish<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    await this.prisma.outboxEvent.create({
      data: {
        id: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        version: event.version,
        payload: event.payload as object,
      },
    });
  }
}

