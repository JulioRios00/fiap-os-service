import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceOrderModule } from './modules/service-order.module';
import { HealthModule } from './modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServiceOrderModule,
    HealthModule,
  ],
})
export class AppModule {}

