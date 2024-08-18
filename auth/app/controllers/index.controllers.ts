import { roleDatamapper, userDatamapper } from "../datamappers/index.datamappers";
import { AuthController } from "./entityControllers/AuthController";
import { RoleController } from "./entityControllers/RoleController";
import { UserController } from "./entityControllers/UserController";

const roleController = new RoleController(roleDatamapper);
const userController = new UserController(userDatamapper);
const authController = new AuthController(userDatamapper);

export { 
  roleController, 
  userController,
  authController
};