import { Request, Response } from "express";
import { AreaService } from "../services/area.service";
import { asyncHandler } from "../utils/controller.utils";
import { createAreaSchema, deleteAreaSchema, updateAreaSchema } from "../schemas/area.schema";

const service = new AreaService();

export const listAreas = asyncHandler(async (_req: Request, res: Response) => {
  const items = await service.list();
  res.json(items);
});

export const getAreaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteAreaSchema.parse(req.params);
  const item = await service.findById(id);
  res.json(item);
});

export const createArea = asyncHandler(async (req: Request, res: Response) => {
  const data = createAreaSchema.parse(req.body);
  const item = await service.create(data);
  res.status(201).json(item);
});

export const updateArea = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteAreaSchema.parse(req.params);
  const body = updateAreaSchema.parse(req.body);
  const item = await service.update({ ...body, id });
  res.json(item);
});

export const deleteArea = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteAreaSchema.parse(req.params);
  const deleted = await service.delete({ id });
  res.json({ deleted });
});
