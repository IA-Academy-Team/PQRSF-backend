import { Request, Response } from "express";
import { CreatePqrsDTO, UpdatePqrsDTO } from "../DTOs/pqrs.dto";
import { PqrsService } from "../services/pqrs.service";
import {
  asyncHandler,
  parseNumberParam,
  parseOptionalDateQuery,
  parseOptionalNumberQuery,
} from "../utils/controller.utils";

const service = new PqrsService();

export const createPqrs = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreatePqrsDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getPqrsById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id);
  res.json(result);
});

export const listPqrs = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.list({
    pqrsStatusId: parseOptionalNumberQuery(req.query.pqrsStatusId, "pqrsStatusId"),
    areaId: parseOptionalNumberQuery(req.query.areaId, "areaId"),
    ticketNumber:
      typeof req.query.ticketNumber === "string" ? req.query.ticketNumber : undefined,
    fromDate: parseOptionalDateQuery(req.query.fromDate, "fromDate"),
    toDate: parseOptionalDateQuery(req.query.toDate, "toDate"),
  });
  res.json(result);
});

export const updatePqrs = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdatePqrsDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deletePqrs = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
