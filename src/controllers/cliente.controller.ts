import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";
import { CreateClienteDTO, UpdateClienteDTO } from "../DTOs/cliente.dto";
import { asyncHandler, parseBigIntParam } from "../utils/controller.utils";

const service = new ClienteService();

export const createCliente = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateClienteDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getClienteById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseBigIntParam(req.params.id, "id");
  const result = await service.findById(id as bigint);
  res.json(result);
});

export const updateCliente = asyncHandler(async (req: Request, res: Response) => {
  const id = parseBigIntParam(req.params.id, "id");
  const data = { ...(req.body as UpdateClienteDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteCliente = asyncHandler(async (req: Request, res: Response) => {
  const id = parseBigIntParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: bigint });
  res.json({ deleted: result });
});
