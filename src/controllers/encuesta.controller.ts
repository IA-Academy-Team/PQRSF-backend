import { Request, Response } from "express";
import { EncuestaService } from "../services/encuesta.service";
import { CreateEncuestaDTO, UpdateEncuestaDTO } from "../DTOs/encuesta.dto";
import { asyncHandler, parseNumberParam } from "./controller.utils";

const service = new EncuestaService();

export const createEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateEncuestaDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getEncuestaById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateEncuestaDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
