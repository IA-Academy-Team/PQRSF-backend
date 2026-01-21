import { Request, Response } from "express";
import { CuentaService } from "../services/cuenta.service";
import { CreateCuentaDTO, UpdateCuentaDTO } from "../DTOs/cuenta.dto";
import { asyncHandler, parseNumberParam } from "./controller.utils";

const service = new CuentaService();

export const createCuenta = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateCuentaDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getCuentaById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateCuenta = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateCuentaDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteCuenta = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
