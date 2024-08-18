import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, NotFoundError } from "@zencorp/engrenages";
import { RoleControllerRequirements } from "../interfaces/RoleControllerRequirements";
import { RoleDatamapperRequirements } from "../../datamappers/interfaces/RoleDatamapperRequirements";

export class RoleController extends CoreController<RoleControllerRequirements, RoleDatamapperRequirements> {
  constructor(datamapper: RoleControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { name }: Partial<RoleDatamapperRequirements["data"]> = req.body;

    const roleToUpdate = await this.datamapper.findByPk(id);

    if (!roleToUpdate) {
      throw new NotFoundError();
    }

    if (roleToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the role");
    }
    
    const currentVersion: number = roleToUpdate.version;

    name ? name : name = roleToUpdate.name;

    const newRoleData = { 
      ...roleToUpdate, 
      name
    };

    const updatedRole = await this.datamapper.update(newRoleData, currentVersion);

    if (!updatedRole) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedRole);
  }
}