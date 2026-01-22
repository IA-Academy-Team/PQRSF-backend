import { Request, Response } from "express";
import { ResponsableService } from "../services/responsable.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createResponsableSchema,
  deleteResponsableSchema,
  updateResponsableSchema,
} from "../schemas/responsable.schema";

const service = new ResponsableService();

export const createResponsable = asyncHandler(async (req: Request, res: Response) => {
  const data = createResponsableSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getResponsableById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteResponsableSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateResponsable = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteResponsableSchema.parse(req.params);
  const body = updateResponsableSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteResponsable = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteResponsableSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});

export const getAllResponsables = asyncHandler(async (req: Request, res: Response) => {
  const responsables = await service.findAll();
  res.json(responsables);
});