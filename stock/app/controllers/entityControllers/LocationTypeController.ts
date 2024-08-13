import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, NotFoundError } from "@zencorp/engrenages";
import { LocationTypeControllerRequirements } from "../interfaces/LocationTypeControllerRequirements";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";

export class LocationTypeController extends CoreController<LocationTypeControllerRequirements, LocationTypeDatamapperRequirements> {
  constructor(datamapper: LocationTypeControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  getBySpecificField = async (field: string, value:string) => {
    const item = await this.datamapper.findBySpecificField(field, value);
    return item;
  }

  createT = async (data: LocationTypeDatamapperRequirements["data"]): Promise<LocationTypeDatamapperRequirements["data"]> => {
    const createdItem = await this.datamapper.insert(data);
    return createdItem;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { name, length, width, height }: Partial<LocationTypeDatamapperRequirements["data"]> = req.body;

    const locationTypeToUpdate = await this.datamapper.findByPk(id);

    if (!locationTypeToUpdate) {
      throw new NotFoundError();
    }

    if (locationTypeToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = locationTypeToUpdate.version;

    name ? name : name = locationTypeToUpdate.name;
    length ? length : length = locationTypeToUpdate.length;
    width ? width : width = locationTypeToUpdate.width;
    height ? height : height = locationTypeToUpdate.height;

    const newDataLocationType = { 
      ...locationTypeToUpdate, 
      name,
      length,
      width,
      height
    };

    const updatedLocationType = await this.datamapper.update(newDataLocationType, currentVersion);

    if (!updatedLocationType) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedLocationType);
  }

  updateT = async (data: LocationTypeDatamapperRequirements["data"], currentVersion: number): Promise<LocationTypeDatamapperRequirements["data"]> => {
    const id = data.id;

    if (!id) {
      throw new BadRequestError("Missing id");
    }

    let { name, length, width, height }: Partial<LocationTypeDatamapperRequirements["data"]> = data;

    const locationTypeToUpdate = await this.datamapper.findByPk(id);

    if (!locationTypeToUpdate) {
      throw new NotFoundError();
    }

    if (locationTypeToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }

    name ? name : name = locationTypeToUpdate.name;
    length ? length : length = locationTypeToUpdate.length;
    width ? width : width = locationTypeToUpdate.width;
    height ? height : height = locationTypeToUpdate.height;

    const newDataLocationType = { 
      ...locationTypeToUpdate, 
      name,
      length,
      width,
      height
    };

    const updatedLocationType = await this.datamapper.update(newDataLocationType, currentVersion);

    if (!updatedLocationType) {
      throw new DatabaseConnectionError();
    }

    return updatedLocationType;
  }

  deleteT = async (id: number): Promise<LocationTypeDatamapperRequirements["data"]> => {
    const deletedItem = await this.datamapper.delete(id);
    return deletedItem;
  }
}