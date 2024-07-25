import { locationDatamapper, locationTypeDatamapper } from "../datamappers/index.datamappers";
import { LocationController } from "./entityControllers/LocationController";
import { LocationTypeController } from "./entityControllers/LocationTypeController";

const locationTypeController = new LocationTypeController(locationTypeDatamapper);
const locationController = new LocationController(locationDatamapper)

export { 
  locationTypeController,
  locationController
};