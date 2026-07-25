import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateServiceOrderUseCase } from '../../application/use-cases/create-service-order.use-case';
import { UpdateServiceOrderStatusUseCase } from '../../application/use-cases/update-service-order-status.use-case';
import { GetServiceOrderUseCase } from '../../application/use-cases/get-service-order.use-case';
import { ListServiceOrderHistoryUseCase } from '../../application/use-cases/list-service-order-history.use-case';
import { CancelServiceOrderUseCase } from '../../application/use-cases/cancel-service-order.use-case';
import { CreateServiceOrderDto } from '../dtos/create-service-order.dto';
import { UpdateServiceOrderStatusDto } from '../dtos/update-service-order-status.dto';

@ApiTags('service-orders')
@ApiHeader({ name: 'x-correlation-id', required: false, description: 'Propagated to domain events and logs for distributed tracing' })
@Controller('service-orders')
export class ServiceOrderController {
  constructor(
    private readonly createUseCase: CreateServiceOrderUseCase,
    private readonly updateStatusUseCase: UpdateServiceOrderStatusUseCase,
    private readonly getUseCase: GetServiceOrderUseCase,
    private readonly historyUseCase: ListServiceOrderHistoryUseCase,
    private readonly cancelUseCase: CancelServiceOrderUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Open a new service order' })
  async create(@Body() dto: CreateServiceOrderDto, @Headers('x-correlation-id') correlationId?: string) {
    const order = await this.createUseCase.execute({ description: dto.description, correlationId });
    return order.toJSON();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update service order status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceOrderStatusDto,
    @Headers('x-correlation-id') correlationId?: string,
  ) {
    const order = await this.updateStatusUseCase.execute({
      id,
      status: dto.status,
      reason: dto.reason,
      correlationId,
    });
    return order.toJSON();
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Compensation endpoint: cancel service order' })
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason?: string,
    @Headers('x-correlation-id') correlationId?: string,
  ) {
    const order = await this.cancelUseCase.execute({ id, reason, correlationId });
    return order.toJSON();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service order by ID' })
  async findOne(@Param('id') id: string) {
    const order = await this.getUseCase.execute(id);
    return order.toJSON();
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get service order status history' })
  async history(@Param('id') id: string) {
    return this.historyUseCase.execute(id);
  }
}
