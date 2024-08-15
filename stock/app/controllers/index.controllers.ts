import { ProductController} from "./entityControllers/ProductController";
import { productBlockageDatamapper, locationBlockageDatamapper, locationDatamapper, locationTypeDatamapper, productDatamapper } from "../datamappers/index.datamappers";
import { LocationTypeController } from "./entityControllers/LocationTypeController";
import { LocationController } from "./entityControllers/LocationController";
import { LocationBlockageController } from "./entityControllers/LocationBlockageController";
import { ProductBlockageController } from "./entityControllers/ProductBlockageController";

const productController = new ProductController(productDatamapper);
const productBlockageController = new ProductBlockageController(productBlockageDatamapper);

const locationTypeController = new LocationTypeController(locationTypeDatamapper);
const locationController = new LocationController(locationDatamapper);
const locationBlockageController = new LocationBlockageController(locationBlockageDatamapper);

export { 
  productController, 
  productBlockageController,
  locationTypeController,
  locationController,
  locationBlockageController
};