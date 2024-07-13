import { roleDatamapper, userDatamapper } from "../datamappers/index.datamappers";
import { RoleController } from "./entityControllers/RoleController";
import { UserController } from "./entityControllers/UserController";

const roleController = new RoleController(roleDatamapper);
const userController = new UserController(userDatamapper);

export { roleController, userController };