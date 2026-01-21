import { Request, Response } from "express";
import { ResponsableService } from "../services/responsable.service";
import { CreateResponsableDTO, UpdateResponsableDTO } from "../DTOs/responsable.dto";
import { asyncHandler, parseNumberParam } from "../utils/controller.utils";

const service = new ResponsableService();

export const createResponsable = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateResponsableDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getResponsableById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateResponsable = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateResponsableDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteResponsable = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
