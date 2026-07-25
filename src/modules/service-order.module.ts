import { Module } from '@nestjs/common';
import { ServiceOrderController } from '../presentation/controllers/service-order.controller';
import { CreateServiceOrderUseCase } from '../application/use-cases/create-service-order.use-case';
import { UpdateServiceOrderStatusUseCase } from '../application/use-cases/update-service-order-status.use-case';
import { GetServiceOrderUseCase } from '../application/use-cases/get-service-order.use-case';
import { ListServiceOrderHistoryUseCase } from '../application/use-cases/list-service-order-history.use-case';
import { CancelServiceOrderUseCase } from '../application/use-cases/cancel-service-order.use-case';
import { ServiceOrderRepositoryPort } from '../application/ports/service-order-repository.port';
import { DomainEventPublisherPort } from '../application/ports/domain-event-publisher.port';
import { PrismaServiceOrderRepository } from '../infra/repositories/prisma-service-order.repository';
import { OutboxEventPublisher } from '../infra/events/outbox-event.publisher';
import { PrismaService } from '../infra/database/prisma.service';

@Module({
  controllers: [ServiceOrderController],
  providers: [
    PrismaService,
    {
      provide: ServiceOrderRepositoryPort,
      useClass: PrismaServiceOrderRepository,
    },
    {
      provide: DomainEventPublisherPort,
      useClass: OutboxEventPublisher,
    },
    CreateServiceOrderUseCase,
    UpdateServiceOrderStatusUseCase,
    GetServiceOrderUseCase,
    ListServiceOrderHistoryUseCase,
    CancelServiceOrderUseCase,
  ],
  exports: [ServiceOrderRepositoryPort],
})
export class ServiceOrderModule {}

