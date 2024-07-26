import { locationBlockageDatamapper, locationDatamapper, locationTypeDatamapper } from "../datamappers/index.datamappers";
import { LocationBlockageController } from "./entityControllers/LocationBlockageController";
import { LocationController } from "./entityControllers/LocationController";
import { LocationTypeController } from "./entityControllers/LocationTypeController";

const locationTypeController = new LocationTypeController(locationTypeDatamapper);
const locationController = new LocationController(locationDatamapper);
const locationBlockageController = new LocationBlockageController(locationBlockageDatamapper);

export { 
  locationTypeController,
  locationController,
  locationBlockageController
};