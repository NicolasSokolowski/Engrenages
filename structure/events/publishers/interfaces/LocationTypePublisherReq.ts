import { PublisherReq } from "@zencorp/engrenages";
import { LocationTypeDatamapperRequirements } from "../../../app/datamappers/interfaces/LocationTypeDatamapperRequirements"; 

export interface LocationTypePublisherReq extends PublisherReq {
  data: LocationTypeDatamapperRequirements["data"];
}