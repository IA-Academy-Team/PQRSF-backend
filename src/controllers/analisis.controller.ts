import { Request, Response } from "express";
import { AnalisisService } from "../services/analisis.service";
import { CreateAnalisisDTO, UpdateAnalisisDTO } from "../DTOs/analisis.dto";
import { asyncHandler, parseNumberParam } from "../utils/controller.utils";

const service = new AnalisisService();

export const createAnalisis = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateAnalisisDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getAnalisisById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateAnalisis = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateAnalisisDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteAnalisis = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
