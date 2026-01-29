import { Request, Response } from "express";
import { AnalisisService } from "../services/analisis.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createAnalisisSchema,
  deleteAnalisisSchema,
  updateAnalisisSchema,
} from "../schemas/analisis.schema";

const service = new AnalisisService();

export const createAnalisis = asyncHandler(async (req: Request, res: Response) => {
  const data = createAnalisisSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getAnalisisById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteAnalisisSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateAnalisis = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteAnalisisSchema.parse(req.params);
  const body = updateAnalisisSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteAnalisis = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteAnalisisSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
