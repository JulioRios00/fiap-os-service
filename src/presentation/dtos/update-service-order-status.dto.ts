import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ServiceOrderStatus } from '../../domain/entities/service-order.entity';

export class UpdateServiceOrderStatusDto {
  @ApiProperty({
    enum: ['OPEN', 'AWAITING_QUOTE', 'QUOTE_APPROVED', 'IN_EXECUTION', 'COMPLETED', 'CANCELLED'],
  })
  @IsIn(['OPEN', 'AWAITING_QUOTE', 'QUOTE_APPROVED', 'IN_EXECUTION', 'COMPLETED', 'CANCELLED'])
  status: ServiceOrderStatus;

  @ApiProperty({ required: false, example: 'Quote approved by customer' })
  @IsOptional()
  @IsString()
  reason?: string;
}

