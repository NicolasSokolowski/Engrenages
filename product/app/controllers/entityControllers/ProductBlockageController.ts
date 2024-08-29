import { BadRequestError, CoreController } from "@zencorp/engrenages";
import { ProductBlockageControllerRequirements } from "../interfaces/BlockageControllerRequirements"; 
import { productController } from "../index.controllers";
import { ProductBlockageCreationRequestPublisher, ProductBlockageDeletionRequestPublisher, ProductBlockageUpdateRequestPublisher } from "../../../events/index.events";
import { ProductBlockageDatamapperRequirements } from "../../datamappers/interfaces/ProductBlockageDatamapperRequirements";


export class ProductBlockageController extends CoreController<ProductBlockageControllerRequirements, ProductBlockageDatamapperRequirements> {

  constructor(datamapper: ProductBlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: ProductBlockageCreationRequestPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: ["name"],
        Publisher: ProductBlockageUpdateRequestPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: ["product_blockage_name"],
        Publisher: ProductBlockageDeletionRequestPublisher,
        exchangeName: "logisticExchange"
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