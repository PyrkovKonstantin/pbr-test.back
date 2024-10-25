import { Injectable } from '@nestjs/common';
import config from '../../config';
import amqp from 'amqplib';
import AmqpManager, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { queueNames } from '../../constants/queue.constant';
import { logger } from '../../libs/logger';

@Injectable()
export class AmqpBrokerService {
  private readonly broker: AmqpConnectionManager;
  private readonly channel: ChannelWrapper;
  private readonly queueNames = queueNames;

  constructor() {
    const connectionString = `amqp://${config.amqpUser}:${config.amqpPassword}@${config.amqpHost}:${config.amqpPort}`;
    this.broker = AmqpManager.connect([connectionString]);
    this.channel = this.broker.createChannel({
      json: true,
      setup: (channel: any) => {
        for (const queueName in this.queueNames) {
          channel.assertQueue(queueName).then(logger.log);
        }
      },
    });
  }

  consume(
    queue: string,
    callback: (msg: amqp.ConsumeMessage) => Promise<void>,
  ) {
    return this.channel.consume(queue, callback);
  }
  nack(msg: amqp.ConsumeMessage) {
    return this.channel.nack(msg);
  }
  ack(msg: amqp.ConsumeMessage) {
    return this.channel.ack(msg);
  }
  send(queue: string, data: Record<string, unknown>) {
    return this.channel.sendToQueue(queue, data);
  }

  async close() {
    return this.channel.close();
  }
}
