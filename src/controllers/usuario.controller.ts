import { Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { CreateUsuarioDTO, UpdateUsuarioDTO } from "../DTOs/usuario.dto";
import { asyncHandler, parseNumberParam } from "./controller.utils";

const service = new UsuarioService();

export const createUsuario = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateUsuarioDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getUsuarioById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateUsuario = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateUsuarioDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteUsuario = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
