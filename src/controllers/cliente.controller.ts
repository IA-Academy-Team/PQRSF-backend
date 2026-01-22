import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createClienteSchema,
  deleteClienteSchema,
  updateClienteSchema,
} from "../schemas/cliente.schema";

const service = new ClienteService();

export const createCliente = asyncHandler(async (req: Request, res: Response) => {
  const data = createClienteSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getClienteById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteClienteSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateCliente = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteClienteSchema.parse(req.params);
  const body = updateClienteSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteCliente = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteClienteSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
