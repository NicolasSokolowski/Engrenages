import { CoreController } from "@zencorp/engrenages";
import { ProductControllerRequirements } from "../interfaces/ProductControllerRequirements";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";
import { ProductCreationRequestPublisher, ProductDeletionRequestPublisher, ProductUpdateRequestPublisher } from "../../../events/index.events";


export class ProductController extends CoreController<ProductControllerRequirements, ProductDatamapperRequirements> {
  constructor(datamapper: ProductControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["title", "ean"],
        Publisher: ProductCreationRequestPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: ["title", "ean"],
        Publisher: ProductUpdateRequestPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: [],
        Publisher: ProductDeletionRequestPublisher,
        exchangeName: "logisticExchange"
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}