import { Request, Response } from "express";
import { ReanalisisService } from "../services/reanalisis.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createReanalisisSchema,
  deleteReanalisisSchema,
  updateReanalisisSchema,
} from "../schemas/reanalisis.schema";

const service = new ReanalisisService();

export const createReanalisis = asyncHandler(async (req: Request, res: Response) => {
  const data = createReanalisisSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getReanalisisById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteReanalisisSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateReanalisis = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteReanalisisSchema.parse(req.params);
  const body = updateReanalisisSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteReanalisis = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteReanalisisSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
