import { ConsumerReq } from "@zencorp/engrenages";
import { LocationDatamapperRequirements } from "../../../app/datamappers/interfaces/LocationDatamapperRequirements";

export interface LocationConsumerReq extends ConsumerReq {
  data: LocationDatamapperRequirements["data"];
}