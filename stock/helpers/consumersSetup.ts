import { RabbitmqManager } from "@zencorp/engrenages";
import * as consumers from "../events/index.events";

export const consumersSetup = async () => {
  const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  const rabbitmqSubChan = rabbitMQ.getSubChannel();
  console.log("Connected to RabbitMQ");

  const exchange = "logisticExchange";

  new consumers.LocationCreatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationUpdatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationDeletedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationBlockageCreatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationBlockageUpdatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationBlockageDeletedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationTypeCreatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationTypeUpdatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationTypeDeletedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductCreatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductUpdateConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductDeletedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductBlockageCreatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductBlockageUpdatedConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductBlockageDeletedConsumer(rabbitmqSubChan, exchange).consume();
}