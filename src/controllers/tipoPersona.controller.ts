import { Request, Response } from "express";
import { TipoPersonaService } from "../services/tipoPersona.service";
import { asyncHandler } from "../utils/controller.utils";
import { createTipoPersonaSchema, deleteTipoPersonaSchema, updateTipoPersonaSchema } from "../schemas/tipoPersona.schema";

const service = new TipoPersonaService();

export const listTipoPersona = asyncHandler(async (_req: Request, res: Response) => {
  const items = await service.list();
  res.json(items);
});

export const getTipoPersonaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoPersonaSchema.parse(req.params);
  const item = await service.findById(id);
  res.json(item);
});

export const createTipoPersona = asyncHandler(async (req: Request, res: Response) => {
  const data = createTipoPersonaSchema.parse(req.body);
  const item = await service.create(data);
  res.status(201).json(item);
});

export const updateTipoPersona = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoPersonaSchema.parse(req.params);
  const body = updateTipoPersonaSchema.parse(req.body);
  const item = await service.update({ ...body, id });
  res.json(item);
});

export const deleteTipoPersona = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoPersonaSchema.parse(req.params);
  const deleted = await service.delete({ id });
  res.json({ deleted });
});
