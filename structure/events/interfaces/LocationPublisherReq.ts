import { PublisherReq } from "@zencorp/engrenages";
import { LocationDatamapperRequirements } from "../../app/datamappers/interfaces/LocationDatamapperRequirements";

export interface LocationdPublisherReq extends PublisherReq {
  data: LocationDatamapperRequirements["data"];
}