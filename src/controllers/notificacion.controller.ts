import { Request, Response } from "express";
import { CreateNotificacionDTO, UpdateNotificacionDTO } from "../DTOs/notificacion.dto";
import { NotificacionService } from "../services/notificacion.service";
import { asyncHandler, parseNumberParam } from "../utils/controller.utils";

const service = new NotificacionService();

export const createNotificacion = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateNotificacionDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getNotificacionById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id);
  res.json(result);
});

export const listNotificacionesByResponsable = asyncHandler(
  async (req: Request, res: Response) => {
    const responsibleId = parseNumberParam(
      req.query.responsibleId,
      "responsibleId"
    );
    const result = await service.listByResponsible(responsibleId);
    res.json(result);
  }
);

export const countNotificacionesNoLeidas = asyncHandler(
  async (req: Request, res: Response) => {
    const responsibleId = parseNumberParam(
      req.params.responsibleId,
      "responsibleId"
    );
    const result = await service.countUnread(responsibleId);
    res.json({ count: result });
  }
);

export const markNotificacionesAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const updated = await service.markAsRead(ids);
    res.json({ updated });
  }
);

export const updateNotificacion = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateNotificacionDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteNotificacion = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
