import jwt from "jsonwebtoken";
import { UserPayload } from "../helpers/index.helpers";

export const verifyToken = (token: string, secret: string):Promise<UserPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as UserPayload);
      }
    });
  });
};