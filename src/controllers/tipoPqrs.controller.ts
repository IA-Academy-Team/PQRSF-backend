import { Request, Response } from "express";
import { TipoPqrsService } from "../services/tipoPqrs.service";
import { asyncHandler } from "../utils/controller.utils";
import { createTipoPqrsSchema, deleteTipoPqrsSchema, updateTipoPqrsSchema } from "../schemas/tipoPqrs.schema";

const service = new TipoPqrsService();

export const listTipoPqrs = asyncHandler(async (_req: Request, res: Response) => {
  const items = await service.list();
  res.json(items);
});

export const getTipoPqrsById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoPqrsSchema.parse(req.params);
  const item = await service.findById(id);
  res.json(item);
});

export const createTipoPqrs = asyncHandler(async (req: Request, res: Response) => {
  const data = createTipoPqrsSchema.parse(req.body);
  const item = await service.create(data);
  res.status(201).json(item);
});

export const updateTipoPqrs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoPqrsSchema.parse(req.params);
  const body = updateTipoPqrsSchema.parse(req.body);
  const item = await service.update({ ...body, id });
  res.json(item);
});

export const deleteTipoPqrs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoPqrsSchema.parse(req.params);
  const deleted = await service.delete({ id });
  res.json({ deleted });
});
