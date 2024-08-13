import { ProductController} from "./entityControllers/ProductController";
import { blockageDatamapper, locationBlockageDatamapper, locationDatamapper, locationTypeDatamapper, productDatamapper } from "../datamappers/index.datamappers";
import { BlockageController } from "./entityControllers/BlockageController";
import { LocationTypeController } from "./entityControllers/LocationTypeController";
import { LocationController } from "./entityControllers/LocationController";
import { LocationBlockageController } from "./entityControllers/LocationBlockageController";

const productController = new ProductController(productDatamapper);
const blockageController = new BlockageController(blockageDatamapper);

const locationTypeController = new LocationTypeController(locationTypeDatamapper);
const locationController = new LocationController(locationDatamapper);
const locationBlockageController = new LocationBlockageController(locationBlockageDatamapper);

export { 
  productController, 
  blockageController,
  locationTypeController,
  locationController,
  locationBlockageController
};