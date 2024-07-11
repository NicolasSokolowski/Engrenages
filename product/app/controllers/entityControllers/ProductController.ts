import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, NotFoundError } from "@zencorp/engrenages";
import { ProductControllerRequirements } from "../interfaces/ProductControllerRequirements";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";


export class ProductController extends CoreController<ProductControllerRequirements, ProductDatamapperRequirements> {
  constructor(datamapper: ProductControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { title, description, ean, length, width, height, product_img, price, product_blockage_name }: Partial<ProductDatamapperRequirements["data"]> = req.body;

    const productToUpdate = await this.datamapper.findByPk(id);

    if (!productToUpdate) {
      throw new NotFoundError();
    }

    if (productToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = productToUpdate.version;

    title ? title : title = productToUpdate.title;
    description ? description : description = productToUpdate.description;
    ean ? ean : ean = productToUpdate.ean;
    length ? length : length = productToUpdate.length;
    width ? width : width = productToUpdate.width;
    height ? height : height = productToUpdate.height;
    product_img ? product_img : product_img = productToUpdate.product_img;
    price ? price : price = productToUpdate.price;
    product_blockage_name ? product_blockage_name : product_blockage_name = productToUpdate.product_blockage_name;

    const newDataProduct = { 
      ...productToUpdate, 
      title,
      description,
      ean,
      length,
      width,
      height,
      product_img,
      price,
      product_blockage_name
    };

    const updatedProduct = await this.datamapper.update(newDataProduct, currentVersion);

    if (!updatedProduct) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedProduct);
  }  
}