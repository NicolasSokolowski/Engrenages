import { ConsumerReq } from "@zencorp/engrenages";
import { ProductBlockageDatamapperRequirements } from "../../../app/datamappers/interfaces/ProductBlockageDatamapperRequirements";

export interface ProductBlockageConsumerReq extends ConsumerReq {
  data: ProductBlockageDatamapperRequirements["data"];
}