import { Response } from "express";

export const sseClients: { [key: string]: Response} = {};