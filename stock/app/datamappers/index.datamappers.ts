import { LocationBlockageDatamapper } from "./entityDatamappers/LocationBlockageDatamapper";
import { LocationDatamapper } from "./entityDatamappers/LocationDatamapper";
import { LocationTypeDatamapper } from "./entityDatamappers/LocationTypeDatamapper";
import { ProductBlockageDatamapper } from "./entityDatamappers/ProductBlockageDatamapper";
import { ProductDatamapper } from "./entityDatamappers/ProductDatamapper";

const productDatamapper = new ProductDatamapper();
const productBlockageDatamapper = new ProductBlockageDatamapper();

const locationTypeDatamapper = new LocationTypeDatamapper();
const locationDatamapper = new LocationDatamapper();
const locationBlockageDatamapper = new LocationBlockageDatamapper();

export { 
  productDatamapper, 
  productBlockageDatamapper,
  locationTypeDatamapper,
  locationDatamapper,
  locationBlockageDatamapper
};