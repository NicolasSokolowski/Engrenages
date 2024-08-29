import { PublisherReq } from "@zencorp/engrenages";
import { LocationBlockageDatamapperRequirements } from "../../../app/datamappers/interfaces/LocationBlockageDatamapperRequirements"; 

export interface LocationBlockagePublisherReq extends PublisherReq {
  data: LocationBlockageDatamapperRequirements["data"];
}