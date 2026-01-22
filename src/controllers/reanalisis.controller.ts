import { Request, Response } from "express";
import { ReanalisisService } from "../services/reanalisis.service";
import { CreateReanalisisDTO, UpdateReanalisisDTO } from "../DTOs/reanalisis.dto";
import { asyncHandler, parseNumberParam } from "../utils/controller.utils";

const service = new ReanalisisService();

export const createReanalisis = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateReanalisisDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getReanalisisById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateReanalisis = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateReanalisisDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteReanalisis = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
