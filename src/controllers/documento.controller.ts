import { Request, Response } from "express";
import { DocumentoService } from "../services/documento.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createDocumentoSchema,
  deleteDocumentoSchema,
  updateDocumentoSchema,
} from "../schemas/documento.schema";

const service = new DocumentoService();

export const createDocumento = asyncHandler(async (req: Request, res: Response) => {
  const data = createDocumentoSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getDocumentoById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteDocumentoSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const listDocumentosByPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await service.listByPqrsId(pqrsId);
  res.json(result);
});

export const createDocumentoForPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const body = createDocumentoSchema.parse({ ...req.body, pqrsId });
  const result = await service.create(body);
  res.status(201).json(result);
});

export const downloadDocumento = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteDocumentoSchema.parse(req.params);
  const doc = await service.findById(id);
  res.json({ url: doc.url });
});

export const updateDocumento = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteDocumentoSchema.parse(req.params);
  const body = updateDocumentoSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteDocumento = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteDocumentoSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
