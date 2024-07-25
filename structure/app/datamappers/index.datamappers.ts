import { LocationDatamapper } from "./entityDatamappers/LocationDatamapper";
import { LocationTypeDatamapper } from "./entityDatamappers/LocationTypeDatamapper";

const locationTypeDatamapper = new LocationTypeDatamapper();
const locationDatamapper = new LocationDatamapper();

export { 
  locationTypeDatamapper,
  locationDatamapper
};