import { ProductController} from "./ProductController";
import { blockageDatamapper, productDatamapper } from "../datamappers/index.datamapper";
import { BlockageController } from "./BlockageController";

const productController = new ProductController(productDatamapper);
const blockageController = new BlockageController(blockageDatamapper);

export { productController, blockageController };