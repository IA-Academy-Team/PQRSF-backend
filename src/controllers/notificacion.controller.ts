import { Request, Response } from "express";
import { NotificacionService } from "../services/notificacion.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createNotificacionSchema,
  deleteNotificacionSchema,
  markNotificacionesAsReadSchema,
  notificacionListQuerySchema,
  notificacionResponsibleParamSchema,
  updateNotificacionSchema,
} from "../schemas/notificacion.schema";

const service = new NotificacionService();

export const createNotificacion = asyncHandler(async (req: Request, res: Response) => {
  const data = createNotificacionSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getNotificacionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteNotificacionSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const listNotificacionesByResponsable = asyncHandler(
  async (req: Request, res: Response) => {
    const { responsibleId } = notificacionListQuerySchema.parse(req.query);
    const result = await service.listByResponsible(responsibleId);
    res.json(result);
  }
);

export const countNotificacionesNoLeidas = asyncHandler(
  async (req: Request, res: Response) => {
    const { responsibleId } = notificacionResponsibleParamSchema.parse(req.params);
    const result = await service.countUnread(responsibleId);
    res.json({ count: result });
  }
);

export const markNotificacionesAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = markNotificacionesAsReadSchema.parse(req.body);
    const updated = await service.markAsRead(ids);
    res.json({ updated });
  }
);

export const updateNotificacion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteNotificacionSchema.parse(req.params);
  const body = updateNotificacionSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteNotificacion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteNotificacionSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
