import { Request, Response } from "express";
import { CreateMensajeDTO, UpdateMensajeDTO } from "../DTOs/mensaje.dto";
import { MensajeService } from "../services/mensaje.service";
import { asyncHandler, parseBigIntParam, parseNumberParam } from "./controller.utils";

const service = new MensajeService();

export const createMensaje = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateMensajeDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getMensajeById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id);
  res.json(result);
});

export const listMensajesByChat = asyncHandler(async (req: Request, res: Response) => {
  const chatId = parseBigIntParam(req.params.chatId, "chatId");
  const result = await service.listByChat(chatId);
  res.json(result);
});

export const updateMensaje = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateMensajeDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteMensaje = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
