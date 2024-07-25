import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, NotFoundError } from "@zencorp/engrenages";
import { LocationTypeControllerRequirements } from "../interfaces/LocationTypeControllerRequirements";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";

export class LocationTypeController extends CoreController<LocationTypeControllerRequirements, LocationTypeDatamapperRequirements> {
  constructor(datamapper: LocationTypeControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { name, description, length, width, height }: Partial<LocationTypeDatamapperRequirements["data"]> = req.body;

    const locationTypeToUpdate = await this.datamapper.findByPk(id);

    if (!locationTypeToUpdate) {
      throw new NotFoundError();
    }

    if (locationTypeToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = locationTypeToUpdate.version;

    name ? name : name = locationTypeToUpdate.name;
    description ? description : description = locationTypeToUpdate.description;
    length ? length : length = locationTypeToUpdate.length;
    width ? width : width = locationTypeToUpdate.width;
    height ? height : height = locationTypeToUpdate.height;

    const newDataLocationType = { 
      ...locationTypeToUpdate, 
      name,
      description,
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
}