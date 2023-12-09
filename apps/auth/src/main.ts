import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService)
  // await app.listen(3000);
  const USER = configService.get('RABBITMQ_USER')
  const PASSWORD = configService.get('RABBITMQ_PASS')
  const HOST = configService.get('RABBITMQ_HOST')
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,  // it will not automatically ackowledge msg by rabbitmq after received by consumer
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  })

  app.startAllMicroservices()
}
bootstrap();
