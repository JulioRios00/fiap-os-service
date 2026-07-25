import { Injectable } from '@nestjs/common';
import { ServiceOrder, ServiceOrderStatus } from '../../domain/entities/service-order.entity';
import {
  ServiceOrderHistoryEntry,
  ServiceOrderRepositoryPort,
} from '../../application/ports/service-order-repository.port';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaServiceOrderRepository implements ServiceOrderRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(order: ServiceOrder): Promise<ServiceOrder> {
    const count = await this.prisma.serviceOrder.count();
    const orderNumber = `OS${String(count + 1).padStart(6, '0')}`;
    const created = await this.prisma.serviceOrder.create({
      data: {
        orderNumber,
        description: order.getDescription(),
        status: order.getStatus(),
        history: {
          create: {
            newStatus: order.getStatus(),
            reason: 'Service order opened',
          },
        },
      },
    });

    return this.map(created);
  }

  async findById(id: string): Promise<ServiceOrder | null> {
    const data = await this.prisma.serviceOrder.findUnique({
      where: { id },
    });
    return data ? this.map(data) : null;
  }

  async updateStatus(id: string, status: ServiceOrderStatus, reason?: string): Promise<ServiceOrder> {
    const current = await this.prisma.serviceOrder.findUnique({ where: { id } });
    const updated = await this.prisma.serviceOrder.update({
      where: { id },
      data: {
        status,
        history: {
          create: {
            previousStatus: current?.status,
            newStatus: status,
            reason,
          },
        },
      },
    });
    return this.map(updated);
  }

  async listHistory(serviceOrderId: string): Promise<ServiceOrderHistoryEntry[]> {
    const history = await this.prisma.serviceOrderStatusHistory.findMany({
      where: { serviceOrderId },
      orderBy: { createdAt: 'asc' },
    });

    return history.map((item) => ({
      previousStatus: item.previousStatus as ServiceOrderStatus | undefined,
      newStatus: item.newStatus as ServiceOrderStatus,
      reason: item.reason || undefined,
      createdAt: item.createdAt,
    }));
  }

  private map(data: {
    id: string;
    orderNumber: string;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): ServiceOrder {
    return new ServiceOrder({
      id: data.id,
      orderNumber: data.orderNumber,
      description: data.description,
      status: data.status as ServiceOrderStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

