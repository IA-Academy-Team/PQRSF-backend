import { Request, Response } from "express";
import { SesionService } from "../services/sesion.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createSesionSchema,
  deleteSesionSchema,
  updateSesionSchema,
} from "../schemas/sesion.schema";

const service = new SesionService();

export const createSesion = asyncHandler(async (req: Request, res: Response) => {
  const data = createSesionSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getSesionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteSesionSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateSesion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteSesionSchema.parse(req.params);
  const body = updateSesionSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteSesion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteSesionSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
