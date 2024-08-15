import { BlockageDatamapper } from "./entityDatamappers/ProductBlockageDatamapper";
import { ProductDatamapper } from "./entityDatamappers/ProductDatamapper";

const productDatamapper = new ProductDatamapper();
const blockageDatamapper = new BlockageDatamapper();

export { productDatamapper, blockageDatamapper };