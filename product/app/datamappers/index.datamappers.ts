import { ProductBlockageDatamapper } from "./entityDatamappers/ProductBlockageDatamapper";
import { ProductDatamapper } from "./entityDatamappers/ProductDatamapper";

const productDatamapper = new ProductDatamapper();
const blockageDatamapper = new ProductBlockageDatamapper();

export { productDatamapper, blockageDatamapper };