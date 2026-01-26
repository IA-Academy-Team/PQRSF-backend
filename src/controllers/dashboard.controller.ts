import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";
import { asyncHandler } from "../utils/controller.utils";

const service = new DashboardService();

export const getAdminMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.getAdminMetrics();
  res.json(result);
});

export const getAdminChats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.getAdminChats();
  res.json(result);
});

export const getAreaMetrics = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await service.getAreaMetrics(areaId);
  res.json(result);
});

export const getAreaPending = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await service.getAreaPending(areaId);
  res.json(result);
});

export const getAreaAppeals = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await service.getAreaAppeals(areaId);
  res.json(result);
});
