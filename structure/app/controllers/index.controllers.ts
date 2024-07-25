import { locationTypeDatamapper } from "../datamappers/index.datamappers";
import { LocationTypeController } from "./entityControllers/LocationTypeController";

const locationTypeController = new LocationTypeController(locationTypeDatamapper);

export { locationTypeController};