import { RabbitmqManager } from "@zencorp/engrenages";
import * as consumers from "../events/index.events";

export const consumersSetup = async () => {
  const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
  const rabbitmqSubChan = rabbitMQ.getSubChannel();
  console.log("Connected to RabbitMQ");

  const exchange = "logisticExchange";

  new consumers.LocationCreationRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationUpdateRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationDeletionRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationBlockageCreationRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationBlockageUpdateRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationBlockageDeletionRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationTypeCreationRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationTypeUpdateRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.LocationTypeDeletionRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductCreationRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductUpdateRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductDeletionRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductBlockageCreationRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductBlockageUpdateRequestConsumer(rabbitmqSubChan, exchange).consume();
  new consumers.ProductBlockageDeletionRequestConsumer(rabbitmqSubChan, exchange).consume();
}