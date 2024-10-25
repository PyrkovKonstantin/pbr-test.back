import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
  debug: process.env.DEBUG === 'true' ? true : false,
});

const { AMQP_HOST, AMQP_PORT, RABBIT_PASSWORD, PORT } = process.env;

export default {
  appPort: PORT || 5000,

  amqpHost: AMQP_HOST || 'localhost',
  amqpPort: AMQP_PORT || '5672',
  amqpUser: 'guest',
  amqpPassword: RABBIT_PASSWORD || 'guest',
};
