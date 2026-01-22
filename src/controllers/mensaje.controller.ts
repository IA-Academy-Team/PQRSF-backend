import { Request, Response } from "express";
import { MensajeService } from "../services/mensaje.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createMensajeSchema,
  deleteMensajeSchema,
  mensajeChatParamSchema,
  updateMensajeSchema,
} from "../schemas/mensaje.schema";

const service = new MensajeService();

export const createMensaje = asyncHandler(async (req: Request, res: Response) => {
  const data = createMensajeSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getMensajeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteMensajeSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const listMensajesByChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = mensajeChatParamSchema.parse(req.params);
  const result = await service.listByChat(chatId);
  res.json(result);
});

export const updateMensaje = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteMensajeSchema.parse(req.params);
  const body = updateMensajeSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteMensaje = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteMensajeSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
