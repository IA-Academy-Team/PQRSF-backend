import { Request, Response } from "express";
import { TipoDocumentoService } from "../services/tipoDocumento.service";
import { asyncHandler } from "../utils/controller.utils";
import { createTipoDocumentoSchema, deleteTipoDocumentoSchema, updateTipoDocumentoSchema } from "../schemas/tipoDocumento.schema";

const service = new TipoDocumentoService();

export const listTipoDocumento = asyncHandler(async (_req: Request, res: Response) => {
  const items = await service.list();
  res.json(items);
});

export const getTipoDocumentoById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoDocumentoSchema.parse(req.params);
  const item = await service.findById(id);
  res.json(item);
});

export const createTipoDocumento = asyncHandler(async (req: Request, res: Response) => {
  const data = createTipoDocumentoSchema.parse(req.body);
  const item = await service.create(data);
  res.status(201).json(item);
});

export const updateTipoDocumento = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoDocumentoSchema.parse(req.params);
  const body = updateTipoDocumentoSchema.parse(req.body);
  const item = await service.update({ ...body, id });
  res.json(item);
});

export const deleteTipoDocumento = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteTipoDocumentoSchema.parse(req.params);
  const deleted = await service.delete({ id });
  res.json({ deleted });
});
