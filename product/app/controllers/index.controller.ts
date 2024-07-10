import { ProductController} from "./ProductController";
import { productDatamapper } from "../datamappers/index.datamapper";

const productController = new ProductController(productDatamapper);

export { productController };