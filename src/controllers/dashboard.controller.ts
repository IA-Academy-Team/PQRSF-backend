import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";
import { asyncHandler } from "../utils/controller.utils";
import { normalizeValues } from "../utils/validation.utils";

const service = new DashboardService();

const normalizeResponse = <T>(value: T): T => {
  const flatten = (input: unknown): unknown => {
    if (!Array.isArray(input)) return input;
    return input.flatMap((item) => (Array.isArray(item) ? item : [item]));
  };
  const flattened = flatten(value);
  if (Array.isArray(flattened)) {
    return normalizeValues(flattened) as T;
  }
  return normalizeValues([flattened])[0] as T;
};

const flattenRows = <T>(rows: T[] | T[][] | undefined): T[] => {
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => (Array.isArray(row) ? row : [row]));
};

export const getAdminMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.getAdminMetrics();
  const normalized = {
    ...result,
    byStatus: flattenRows(result.byStatus),
    byType: flattenRows(result.byType),
    avgResponseByArea: flattenRows(result.avgResponseByArea),
  };
  res.json(normalizeResponse(normalized));
});

export const getAdminChats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.getAdminChats();
  res.json(normalizeResponse(result));
});

export const getAreaMetrics = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await service.getAreaMetrics(areaId);
  const normalized = {
    ...result,
    byStatus: flattenRows(result.byStatus),
  };
  res.json(normalizeResponse(normalized));
});

export const getAreaPending = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await service.getAreaPending(areaId);
  res.json(normalizeResponse(result));
});

export const getAreaAppeals = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await service.getAreaAppeals(areaId);
  res.json(normalizeResponse(result));
});
