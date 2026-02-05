import { Request, Response } from "express";
import { MensajeService } from "../services/mensaje.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createMensajeSchema,
  deleteMensajeSchema,
  mensajeChatParamSchema,
  updateMensajeSchema,
} from "../schemas/mensaje.schema";
import { broadcastChatMessage, broadcastChatSummary } from "../config/websocket.config";
import { sendChatMessageSchema } from "../schemas/chatIntegration.schema";
import { ChatIntegrationService } from "../services/chat-integration.service";
import { normalizeValues, optionalPositiveInt } from "../utils/validation.utils";

const service = new MensajeService();
const integrationService = new ChatIntegrationService();

const normalizeResponse = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return normalizeValues(value) as T;
  }
  return normalizeValues([value])[0] as T;
};

export const createMensaje = asyncHandler(async (req: Request, res: Response) => {
  const data = createMensajeSchema.parse(req.body);
  const result = await service.create(data);
  const chatId = Number(result.chatId);
  if (Number.isFinite(chatId)) {
    broadcastChatMessage(chatId, result);
    broadcastChatSummary({
      chatId,
      lastMessage: result.content ?? "",
      lastMessageAt: result.createdAt ?? null,
    });
  }
  res.status(201).json(normalizeResponse(result));
});

export const sendChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const data = sendChatMessageSchema.parse(req.body);
  const result = await integrationService.sendAdminMessage(data);
  res.status(201).json(normalizeResponse(result));
});

export const getMensajeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteMensajeSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(normalizeResponse(result));
});

export const listMensajesByChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = mensajeChatParamSchema.parse(req.params);
  const pqrsIdRaw = req.query.pqrsId;
  const pqrsId =
    typeof pqrsIdRaw === "string" && pqrsIdRaw.trim() !== ""
      ? optionalPositiveInt(Number(pqrsIdRaw), "pqrsId")
      : undefined;
  const result = pqrsId ? await service.listByChatAndPqrs(chatId, pqrsId) : await service.listByChat(chatId);
  res.json(normalizeResponse(result));
});

export const updateMensaje = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteMensajeSchema.parse(req.params);
  const body = updateMensajeSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(normalizeResponse(result));
});

export const deleteMensaje = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteMensajeSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
