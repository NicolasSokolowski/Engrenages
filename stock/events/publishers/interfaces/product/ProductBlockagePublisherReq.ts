import { PublisherReq } from "@zencorp/engrenages";
import { ProductBlockageDatamapperRequirements } from "../../../../app/datamappers/interfaces/ProductBlockageDatamapperRequirements";

export interface ProductBlockagePublisherReq extends PublisherReq {
  data: ProductBlockageDatamapperRequirements["data"];
}