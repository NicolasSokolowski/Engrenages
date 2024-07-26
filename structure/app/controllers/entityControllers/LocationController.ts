import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, NotFoundError } from "@zencorp/engrenages";
import { LocationControllerRequirements } from "../interfaces/LocationControllerRequirements";
import { LocationDatamapperRequirements } from "../../datamappers/interfaces/LocationDatamapperRequirements";

export class LocationController extends CoreController<LocationControllerRequirements, LocationDatamapperRequirements> {
  constructor(datamapper: LocationControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { zone, alley, position, lvl, lvl_position, location_type_name, location_blockage_name }: Partial<LocationDatamapperRequirements["data"]> = req.body;

    const locationToUpdate = await this.datamapper.findByPk(id);

    if (!locationToUpdate) {
      throw new NotFoundError();
    }

    if (locationToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = locationToUpdate.version;

    zone ? zone : zone = locationToUpdate.zone;
    alley ? alley : alley = locationToUpdate.alley;
    position ? position : position = locationToUpdate.position;
    lvl ? lvl : lvl = locationToUpdate.lvl;
    lvl_position ? lvl_position : lvl_position = locationToUpdate.lvl_position;
    location_type_name ? location_type_name : location_type_name = locationToUpdate.location_type_name;
    location_blockage_name ? location_blockage_name : location_blockage_name = locationToUpdate.location_blockage_name;

    const newDataLocation = { 
      ...locationToUpdate, 
      zone,
      alley,
      position,
      lvl,
      lvl_position,
      location_type_name,
      location_blockage_name
    };

    const updatedLocation = await this.datamapper.update(newDataLocation, currentVersion);

    if (!updatedLocation) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedLocation);
  }
}