import { CoreController } from "@zencorp/engrenages";
import { ProductControllerRequirements } from "../interfaces/ProductControllerRequirements";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";
import { ProductCreatedPublisher } from "../../../events/publishers/product/ProductCreatedPublisher";
import { ProductUpdatedPublisher } from "../../../events/publishers/product/ProductUpdatedPublisher";
import { ProductDeletedPublisher } from "../../../events/publishers/product/ProductDeletedPublisher";


export class ProductController extends CoreController<ProductControllerRequirements, ProductDatamapperRequirements> {
  constructor(datamapper: ProductControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["title", "ean"],
        Publisher: ProductCreatedPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: ["title", "ean"],
        Publisher: ProductUpdatedPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: [],
        Publisher: ProductDeletedPublisher,
        exchangeName: "logisticExchange"
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}