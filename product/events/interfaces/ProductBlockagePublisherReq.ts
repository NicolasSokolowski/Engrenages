import { PublisherReq } from "@zencorp/engrenages";
import { BlockageDatamapperRequirements } from "../../app/datamappers/interfaces/BlockageDatamapperRequirements";

export interface ProductBlockagePublisherReq extends PublisherReq {
  data: BlockageDatamapperRequirements["data"];
}