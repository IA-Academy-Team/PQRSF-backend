import { Request, Response } from "express";
import { RespuestaService } from "../services/respuesta.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createRespuestaSchema,
  deleteRespuestaSchema,
  updateRespuestaSchema,
} from "../schemas/respuesta.schema";

const service = new RespuestaService();

export const createRespuesta = asyncHandler(async (req: Request, res: Response) => {
  const data = createRespuestaSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getRespuestaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteRespuestaSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateRespuesta = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteRespuestaSchema.parse(req.params);
  const body = updateRespuestaSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteRespuesta = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteRespuestaSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
