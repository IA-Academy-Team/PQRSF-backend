import { Request, Response } from "express";
import { VerificacionService } from "../services/verificacion.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createVerificacionSchema,
  deleteVerificacionSchema,
  updateVerificacionSchema,
} from "../schemas/verificacion.schema";

const service = new VerificacionService();

export const createVerificacion = asyncHandler(async (req: Request, res: Response) => {
  const data = createVerificacionSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getVerificacionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteVerificacionSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateVerificacion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteVerificacionSchema.parse(req.params);
  const body = updateVerificacionSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteVerificacion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteVerificacionSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
