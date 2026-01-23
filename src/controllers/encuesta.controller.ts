import { Request, Response } from "express";
import { EncuestaService } from "../services/encuesta.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createEncuestaSchema,
  deleteEncuestaSchema,
  updateEncuestaSchema,
} from "../schemas/encuesta.schema";

const service = new EncuestaService();

export const createEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const data = createEncuestaSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getEncuestaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEncuestaSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const getEncuestaByPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await service.findByPqrsId(pqrsId);
  res.json(result);
});

export const updateEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEncuestaSchema.parse(req.params);
  const body = updateEncuestaSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEncuestaSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
