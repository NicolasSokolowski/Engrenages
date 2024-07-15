import "dotenv/config";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/index.errors";
import { UserPayload } from "./index.helpers";


export const generateToken = ({ id, email, role }: UserPayload) => {
  const user = { id, email, role };

  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new BadRequestError("Environment variables ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set");
  }

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d"
  });

  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  })

  return { accessToken, refreshToken };
}