import { Request, Response } from "express";
import { EstadoPqrsService } from "../services/estadoPqrs.service";
import { asyncHandler } from "../utils/controller.utils";
import { createEstadoPqrsSchema, deleteEstadoPqrsSchema, updateEstadoPqrsSchema } from "../schemas/estadoPqrs.schema";

const service = new EstadoPqrsService();

export const listEstadoPqrs = asyncHandler(async (_req: Request, res: Response) => {
  const items = await service.list();
  res.json(items);
});

export const getEstadoPqrsById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEstadoPqrsSchema.parse(req.params);
  const item = await service.findById(id);
  res.json(item);
});

export const createEstadoPqrs = asyncHandler(async (req: Request, res: Response) => {
  const data = createEstadoPqrsSchema.parse(req.body);
  const item = await service.create(data);
  res.status(201).json(item);
});

export const updateEstadoPqrs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEstadoPqrsSchema.parse(req.params);
  const body = updateEstadoPqrsSchema.parse(req.body);
  const item = await service.update({ ...body, id });
  res.json(item);
});

export const deleteEstadoPqrs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEstadoPqrsSchema.parse(req.params);
  const deleted = await service.delete({ id });
  res.json({ deleted });
});
