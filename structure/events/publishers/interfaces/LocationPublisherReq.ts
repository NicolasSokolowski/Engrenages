import { PublisherReq } from "@zencorp/engrenages";
import { LocationDatamapperRequirements } from "../../../app/datamappers/interfaces/LocationDatamapperRequirements"; 

export interface LocationPublisherReq extends PublisherReq {
  data: LocationDatamapperRequirements["data"];
}