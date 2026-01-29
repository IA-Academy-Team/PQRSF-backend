import { Request, Response } from "express";
import { StakeholderService } from "../services/stakeholder.service";
import { asyncHandler } from "../utils/controller.utils";
import { createStakeholderSchema, deleteStakeholderSchema, updateStakeholderSchema } from "../schemas/stakeholder.schema";

const service = new StakeholderService();

export const listStakeholders = asyncHandler(async (_req: Request, res: Response) => {
  const items = await service.list();
  res.json(items);
});

export const getStakeholderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteStakeholderSchema.parse(req.params);
  const item = await service.findById(id);
  res.json(item);
});

export const createStakeholder = asyncHandler(async (req: Request, res: Response) => {
  const data = createStakeholderSchema.parse(req.body);
  const item = await service.create(data);
  res.status(201).json(item);
});

export const updateStakeholder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteStakeholderSchema.parse(req.params);
  const body = updateStakeholderSchema.parse(req.body);
  const item = await service.update({ ...body, id });
  res.json(item);
});

export const deleteStakeholder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteStakeholderSchema.parse(req.params);
  const deleted = await service.delete({ id });
  res.json({ deleted });
});
