import { ProductController} from "./entityControllers/ProductController";
import { blockageDatamapper, productDatamapper } from "../datamappers/index.datamappers";
import { ProductBlockageController } from "./entityControllers/ProductBlockageController";

const productController = new ProductController(productDatamapper);
const productBlockageController = new ProductBlockageController(blockageDatamapper);

export { productController, productBlockageController };