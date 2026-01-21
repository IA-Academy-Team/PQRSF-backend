import { Request, Response } from "express";
import { CreatePqrsDTO } from "./pqrs.types";
import { PqrsService } from "./pqrs.service";

const service = new PqrsService();

export const createPqrs = async (req: Request, res: Response) => {
  const data = req.body as CreatePqrsDTO;
  const pqrs = await service.createPqrs(data);
  res.status(201).json(pqrs);
};
