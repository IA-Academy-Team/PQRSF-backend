import { Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createUsuarioSchema,
  deleteUsuarioSchema,
  updateUsuarioSchema,
} from "../schemas/usuario.schema";

const service = new UsuarioService();

export const createUsuario = asyncHandler(async (req: Request, res: Response) => {
  const data = createUsuarioSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getUsuarioById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteUsuarioSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const updateUsuario = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteUsuarioSchema.parse(req.params);
  const body = updateUsuarioSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteUsuario = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteUsuarioSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});

export const listUsuarios = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.list();
  res.json(result);
});
