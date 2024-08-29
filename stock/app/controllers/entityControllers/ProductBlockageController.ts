import { CoreController } from "@zencorp/engrenages";
import { ProductBlockageControllerRequirements } from "../interfaces/ProductBlockageControllerRequirements";
import { ProductBlockageDatamapperRequirements } from "../../datamappers/interfaces/ProductBlockageDatamapperRequirements";
import { ProductBlockageCreatedPublisher } from "../../../events/publishers/product_blockage/ProductBlockageCreatedPublisher";
import { ProductBlockageUpdatedPublisher } from "../../../events/publishers/product_blockage/ProductBlockageUpdateRequestPublisher";
import { ProductBlockageDeletedPublisher } from "../../../events/publishers/product_blockage/ProductBlockageDeletedPublisher";

export class ProductBlockageController extends CoreController<ProductBlockageControllerRequirements, ProductBlockageDatamapperRequirements> {
  constructor(datamapper: ProductBlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: ProductBlockageCreatedPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: ["name"],
        Publisher: ProductBlockageUpdatedPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: ["product_blockage_name"],
        Publisher: ProductBlockageDeletedPublisher,
        exchangeName: "logisticExchange"
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }  
};