import { ConsumerReq } from "@zencorp/engrenages";
import { LocationTypeDatamapperRequirements } from "../../../app/datamappers/interfaces/LocationTypeDatamapperRequirements";

export interface LocationTypeConsumerReq extends ConsumerReq {
  data: LocationTypeDatamapperRequirements["data"];
}