import { Request, Response } from "express";
import { BadRequestError, DatabaseConnectionError, NotFoundError } from "../errors/index.errors";
import { EntityControllerRequirements } from "../controllers/index.controllers";
import { EntityDatamapperRequirements } from "../datamappers/index.datamappers";

export abstract class CoreController<T extends EntityControllerRequirements, Y extends EntityDatamapperRequirements> {
  abstract update(req: Request, res: Response): Promise<void>;

  constructor(public datamapper: T["datamapper"]) {}

  getByPk = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("You should provide an id")
    }

    const searchedItem = await this.datamapper.findByPk(id);

    if (!searchedItem) {
      throw new NotFoundError();
    }

    res.status(200).send(searchedItem);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    const itemsList = await this.datamapper.findAll();

    if (!itemsList) {
      throw new DatabaseConnectionError()
    }

    res.status(200).send(itemsList);
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const item: Y["data"] = req.body;

    const createdItem = await this.datamapper.insert(item);

    res.status(201).json(createdItem);
  }

  delete = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist")
    }

    const itemToDelete = await this.datamapper.findByPk(id);

    if (!itemToDelete) {
      throw new NotFoundError();
    }

    const deletedItem = await this.datamapper.delete(id);

    if (!deletedItem) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(deletedItem);
  }
}