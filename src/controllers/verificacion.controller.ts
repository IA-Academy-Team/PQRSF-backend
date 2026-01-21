import { Request, Response } from "express";
import { VerificacionService } from "../services/verificacion.service";
import { CreateVerificacionDTO, UpdateVerificacionDTO } from "../DTOs/verificacion.dto";
import { asyncHandler, parseNumberParam } from "./controller.utils";

const service = new VerificacionService();

export const createVerificacion = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateVerificacionDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getVerificacionById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateVerificacion = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateVerificacionDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteVerificacion = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
