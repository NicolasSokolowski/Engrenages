import { LocationBlockageDatamapper } from "./entityDatamappers/LocationBlockageDatamapper";
import { LocationDatamapper } from "./entityDatamappers/LocationDatamapper";
import { LocationTypeDatamapper } from "./entityDatamappers/LocationTypeDatamapper";

const locationTypeDatamapper = new LocationTypeDatamapper();
const locationDatamapper = new LocationDatamapper();
const locationBlockageDatamapper = new LocationBlockageDatamapper();

export { 
  locationTypeDatamapper,
  locationDatamapper,
  locationBlockageDatamapper
};