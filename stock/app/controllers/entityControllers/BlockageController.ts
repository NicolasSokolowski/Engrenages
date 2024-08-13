import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, NotFoundError } from "@zencorp/engrenages";
import { BlockageControllerRequirements } from "../interfaces/BlockageControllerRequirements";
import { BlockageDatamapperRequirements } from "../../datamappers/interfaces/BlockageDatamapperRequirements";

export class BlockageController extends CoreController<BlockageControllerRequirements, BlockageDatamapperRequirements> {
  constructor(datamapper: BlockageControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { name }: Partial<BlockageDatamapperRequirements["data"]> = req.body;

    const productToUpdate = await this.datamapper.findByPk(id);

    if (!productToUpdate) {
      throw new NotFoundError();
    }

    if (productToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = productToUpdate.version;

    name ? name : name = productToUpdate.name;

    const newDataProduct = { 
      ...productToUpdate, 
      name
    };

    const updatedProduct = await this.datamapper.update(newDataProduct, currentVersion);

    if (!updatedProduct) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedProduct);
  }     
};