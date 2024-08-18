import { RoleDatamapper } from "./entityDatamappers/RoleDatamapper";
import { UserDatamapper } from "./entityDatamappers/UserDatamapper";

const roleDatamapper = new RoleDatamapper();
const userDatamapper = new UserDatamapper();

export { roleDatamapper, userDatamapper };