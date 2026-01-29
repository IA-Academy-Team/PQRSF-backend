import { Request, Response } from "express";
import { CuentaService } from "../services/cuenta.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createCuentaSchema,
  deleteCuentaSchema,
  updateCuentaSchema,
} from "../schemas/cuenta.schema";

const service = new CuentaService();

export const createCuenta = asyncHandler(async (req: Request, res: Response) => {
  const data = createCuentaSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getCuentaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteCuentaSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateCuenta = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteCuentaSchema.parse(req.params);
  const body = updateCuentaSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteCuenta = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteCuentaSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
