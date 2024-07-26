import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, NotFoundError } from "@zencorp/engrenages";
import { LocationBlockageControllerRequirements } from "../interfaces/LocationBlockageControllerRequirements";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";

export class LocationBlockageController extends CoreController<LocationBlockageControllerRequirements, LocationBlockageDatamapperRequirements> {
  constructor(datamapper: LocationBlockageControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { name, description }: Partial<LocationBlockageDatamapperRequirements["data"]> = req.body;

    const locationBlockageToUpdate = await this.datamapper.findByPk(id);

    if (!locationBlockageToUpdate) {
      throw new NotFoundError();
    }

    if (locationBlockageToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = locationBlockageToUpdate.version;

    name ? name : name = locationBlockageToUpdate.name;
    description ? description : description = locationBlockageToUpdate.description;

    const newDataLocationBlockage = { 
      ...locationBlockageToUpdate, 
      name,
      description
    };

    const updatedLocationBlockage = await this.datamapper.update(newDataLocationBlockage, currentVersion);

    if (!updatedLocationBlockage) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedLocationBlockage);    
  }
}