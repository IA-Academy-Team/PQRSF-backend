import { Request, Response } from "express";
import { PqrsService } from "../services/pqrs.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createPqrsSchema,
  deletePqrsSchema,
  pqrsListQuerySchema,
  updatePqrsSchema,
} from "../schemas/pqrs.schema";

const service = new PqrsService();

export const createPqrs = asyncHandler(async (req: Request, res: Response) => {
  const data = createPqrsSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getPqrsById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deletePqrsSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const listPqrs = asyncHandler(async (req: Request, res: Response) => {
  const filters = pqrsListQuerySchema.parse(req.query);
  const result = await service.list(filters);
  res.json(result);
});

export const updatePqrs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deletePqrsSchema.parse(req.params);
  const body = updatePqrsSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deletePqrs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deletePqrsSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
