import { NextFunction, Request, Response } from "express";
import { BadRequestError, CoreController, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { BlockageControllerRequirements } from "../interfaces/BlockageControllerRequirements";
import { BlockageDatamapperRequirements } from "../../datamappers/interfaces/BlockageDatamapperRequirements";
import { ProductBlockageCreatedPublisher, ProductBlockageDeletedPublisher, ProductBlockageUpdatedPublisher } from "../../../events/index.events";
import { productController } from "../index.controllers";


export class ProductBlockageController extends CoreController<BlockageControllerRequirements, BlockageDatamapperRequirements> {

  constructor(datamapper: BlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: ProductBlockageCreatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "update": {
        fields: ["name"],
        Publisher: ProductBlockageUpdatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "delete": {
        fields: ["product_blockage_name"],
        Publisher: ProductBlockageDeletedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }

  preDeletionCheck = async (fields: string[], value: any): Promise<void> => {
    const checkIfUsed = await Promise.any(fields.map((field) => productController.datamapper.findBySpecificField(field, value.name)));

    if (checkIfUsed) {
      throw new BadRequestError("Item still in use.")
    }
  };
};