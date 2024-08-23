import { CoreController } from "@zencorp/engrenages";
import { ProductControllerRequirements } from "../interfaces/ProductControllerRequirements";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";
import { ProductCreatedConsumer, ProductDeletedConsumer, ProductUpdateConsumer } from "../../../events/index.events";


export class ProductController extends CoreController<ProductControllerRequirements, ProductDatamapperRequirements> {
  constructor(datamapper: ProductControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["title", "ean"],
        Publisher: ProductCreatedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "update": {
        fields: ["title", "ean"],
        Publisher: ProductUpdateConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "delete": {
        fields: [],
        Publisher: ProductDeletedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}