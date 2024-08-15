import { ConsumerReq } from "@zencorp/engrenages";
import { LocationBlockageDatamapperRequirements } from "../../../app/datamappers/interfaces/LocationBlockageDatamapperRequirements";

export interface LocationBlockageConsumerReq extends ConsumerReq {
  data: LocationBlockageDatamapperRequirements["data"];
}