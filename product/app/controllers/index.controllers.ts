import { ProductController} from "./entityControllers/ProductController";
import { blockageDatamapper, productDatamapper } from "../datamappers/index.datamappers";
import { BlockageController } from "./entityControllers/BlockageController";

const productController = new ProductController(productDatamapper);
const blockageController = new BlockageController(blockageDatamapper);

export { productController, blockageController };