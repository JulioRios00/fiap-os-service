import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateServiceOrderDto {
  @ApiProperty({ example: 'Engine noise and brake check' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  description: string;
}

