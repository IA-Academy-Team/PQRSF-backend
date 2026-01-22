import { Request, Response } from "express";
import { SesionService } from "../services/sesion.service";
import { CreateSesionDTO, UpdateSesionDTO } from "../DTOs/sesion.dto";
import { asyncHandler, parseNumberParam } from "../utils/controller.utils";

const service = new SesionService();

export const createSesion = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateSesionDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getSesionById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateSesion = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateSesionDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteSesion = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
