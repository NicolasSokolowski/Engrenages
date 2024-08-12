import { RabbitmqManager } from "../events/RabbitmqManager";

export const rabbitmqConnection = async () => {
  const rabbitMQ = RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  await rabbitMQ.connect();
  const channel = await rabbitMQ.createChannel();

  return channel;
}