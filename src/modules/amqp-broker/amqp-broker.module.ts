import { Module } from '@nestjs/common';
import { AmqpBrokerService } from './amqp-broker.service';

@Module({
  providers: [AmqpBrokerService],
  exports: [AmqpBrokerService],
})
export class AmqpBrokerModule {}
