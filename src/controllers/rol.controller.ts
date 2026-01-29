import { Request, Response } from "express";
import { RolService } from "../services/rol.service";
import { asyncHandler } from "../utils/controller.utils";
import { createRolSchema, deleteRolSchema, updateRolSchema } from "../schemas/rol.schema";

const service = new RolService();

export const listRoles = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await service.list();
  res.json(roles);
});

export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteRolSchema.parse(req.params);
  const role = await service.findById(id);
  res.json(role);
});

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const data = createRolSchema.parse(req.body);
  const role = await service.create(data);
  res.status(201).json(role);
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteRolSchema.parse(req.params);
  const body = updateRolSchema.parse(req.body);
  const role = await service.update({ ...body, id });
  res.json(role);
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteRolSchema.parse(req.params);
  const deleted = await service.delete({ id });
  res.json({ deleted });
});
