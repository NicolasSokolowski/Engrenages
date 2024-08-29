import { ConsumerReq } from "@zencorp/engrenages";
import { ProductDatamapperRequirements } from "../../../app/datamappers/interfaces/ProductDatamapperRequirements"; 

export interface ProductPublisherReq extends ConsumerReq {
  data: ProductDatamapperRequirements["data"];
}