import { BlockageDatamapper } from "./entityDatamappers/BlockageDatamapper";
import { LocationBlockageDatamapper } from "./entityDatamappers/LocationBlockageDatamapper";
import { LocationDatamapper } from "./entityDatamappers/LocationDatamapper";
import { LocationTypeDatamapper } from "./entityDatamappers/LocationTypeDatamapper";
import { ProductDatamapper } from "./entityDatamappers/ProductDatamapper";

const productDatamapper = new ProductDatamapper();
const blockageDatamapper = new BlockageDatamapper();

const locationTypeDatamapper = new LocationTypeDatamapper();
const locationDatamapper = new LocationDatamapper();
const locationBlockageDatamapper = new LocationBlockageDatamapper();

export { 
  productDatamapper, 
  blockageDatamapper,
  locationTypeDatamapper,
  locationDatamapper,
  locationBlockageDatamapper
};