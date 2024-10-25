import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AmqpBrokerModule } from './modules/amqp-broker/amqp-broker.module';//

@Module({
  imports: [
    AmqpBrokerModule,//
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
