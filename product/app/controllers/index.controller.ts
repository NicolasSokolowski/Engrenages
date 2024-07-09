import ProductController from "./product.controller";
import { productDatamapper } from "../datamappers/index.datamapper";

const productController = new ProductController(productDatamapper);

export { productController };