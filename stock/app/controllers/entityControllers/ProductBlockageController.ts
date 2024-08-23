import { CoreController } from "@zencorp/engrenages";
import { ProductBlockageControllerRequirements } from "../interfaces/ProductBlockageControllerRequirements";
import { ProductBlockageDatamapperRequirements } from "../../datamappers/interfaces/ProductBlockageDatamapperRequirements";
import { ProductBlockageCreatedConsumer, ProductBlockageDeletedConsumer, ProductBlockageUpdatedConsumer } from "../../../events/index.events";

export class ProductBlockageController extends CoreController<ProductBlockageControllerRequirements, ProductBlockageDatamapperRequirements> {
  constructor(datamapper: ProductBlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: ProductBlockageCreatedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "update": {
        fields: ["name"],
        Publisher: ProductBlockageUpdatedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "delete": {
        fields: ["product_blockage_name"],
        Publisher: ProductBlockageDeletedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }  
};