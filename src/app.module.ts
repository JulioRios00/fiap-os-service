import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { LoggerModule } from 'nestjs-pino';
import { ServiceOrderModule } from './modules/service-order.module';
import { HealthModule } from './modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({ service: 'os-service' }),
        // Correlate every log line with the saga/caller that triggered this
        // request: reuse an incoming x-correlation-id if present, otherwise
        // mint one and echo it back so the caller can pick it up too.
        genReqId: (req, res) => {
          const header = req.headers['x-correlation-id'];
          const correlationId = (Array.isArray(header) ? header[0] : header) || randomUUID();
          res.setHeader('x-correlation-id', correlationId);
          return correlationId;
        },
      },
    }),
    ServiceOrderModule,
    HealthModule,
  ],
})
export class AppModule {}
