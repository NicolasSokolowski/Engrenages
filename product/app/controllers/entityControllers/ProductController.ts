import { NextFunction, Request, Response } from "express";
import { BadRequestError, CoreController, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { ProductControllerRequirements } from "../interfaces/ProductControllerRequirements";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";
import { ProductCreatedPublisher, ProductDeletedPublisher, ProductUpdatedPublisher } from "../../../events/index.events";


export class ProductController extends CoreController<ProductControllerRequirements, ProductDatamapperRequirements> {
  constructor(datamapper: ProductControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["title", "ean"],
        Publisher: ProductCreatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "update": {
        fields: ["title", "ean"],
        Publisher: ProductUpdatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "delete": {
        fields: [],
        Publisher: ProductDeletedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}