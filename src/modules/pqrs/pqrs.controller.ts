import { Request, Response } from "express";
import { createPqrsSchema } from "./pqrs.schema";
import { PqrsService } from "./pqrs.service";

const service = new PqrsService();

export const createPqrs = async (req: Request, res: Response) => {
  const data = createPqrsSchema.parse(req.body);
  const pqrs = await service.createPqrs(data);
  res.status(201).json(pqrs);
};
