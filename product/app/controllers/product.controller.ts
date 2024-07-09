import { Request, Response } from "express";
import { ProductDatamapperInterface, ProductInterface } from "../datamappers/product.datamapper";
import { BadRequestError, DatabaseConnectionError, NotFoundError } from "@zencorp/engrenages";

interface ProductControllerInterface {
  datamapper: ProductDatamapperInterface;
}

export default class ProductController implements ProductControllerInterface {
  constructor(public datamapper: ProductDatamapperInterface) {}

  getByPk = async (req: Request, res: Response) => {
    const productID: number = parseInt(req.params.productID);

    if (!productID) {
      throw new BadRequestError("You should provide an id")
    }

    const product = await this.datamapper.findByPk(productID);

    if (!product) {
      throw new NotFoundError();
    }

    res.status(200).send(product);
  }

  getAll = async (req: Request, res: Response) => {
    const productsList = await this.datamapper.findAll();

    if (!productsList) {
      throw new DatabaseConnectionError()
    }

    res.status(200).send(productsList);
  }

  create = async (req: Request, res: Response) => {
    const product: ProductInterface = req.body;

    const createdProduct = await this.datamapper.insert(product);

    res.status(201).json(createdProduct);
  }

  update = async (req: Request, res: Response) => {
    const productID: number = parseInt(req.params.productID);

    if (!productID) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { title, description, ean, length, width, height, product_img, price }: Partial<ProductInterface> = req.body;

    const productToUpdate = await this.datamapper.findByPk(productID);

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

    const newDataProduct = { 
      ...productToUpdate, 
      title,
      description,
      ean,
      length,
      width,
      height,
      product_img,
      price
    };

    const updatedProduct = await this.datamapper.update(newDataProduct, currentVersion);

    if (!updatedProduct) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedProduct);
  }

  delete = async (req: Request, res: Response) => {
    const productID: number = parseInt(req.params.productID);

    if (!productID) {
      throw new BadRequestError("This id doesn't exist")
    }

    const productToDelete = await this.datamapper.findByPk(productID);

    if (!productToDelete) {
      throw new NotFoundError();
    }

    const deletedProduct = await this.datamapper.delete(productID);

    if (!deletedProduct) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(deletedProduct);
  }
};
