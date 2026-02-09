import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { asyncHandler } from "../utils/controller.utils";
import { normalizeValues } from "../utils/validation.utils";
import {
  chatClientParamSchema,
  chatIdParamSchema,
  createChatSchema,
  deleteChatSchema,
  updateChatSchema,
} from "../schemas/chat.schema";
import { broadcastChatMode, broadcastChatSummary } from "../config/websocket.config";

const service = new ChatService();

const normalizeResponse = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return normalizeValues(value) as T;
  }
  return normalizeValues([value])[0] as T;
};

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const data = createChatSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(normalizeResponse(result));
});

export const getChatById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = chatIdParamSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(normalizeResponse(result));
});

export const listChats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.list();
  res.json(normalizeResponse(result));
});

export const listChatSummaries = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.listSummaries();
  res.json(normalizeResponse(result));
});

export const listChatSummariesByPqrs = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.listSummariesByPqrs();
  res.json(normalizeResponse(result));
});

export const listChatByClient = asyncHandler(async (req: Request, res: Response) => {
  const { clientId } = chatClientParamSchema.parse(req.params);
  const result = await service.findByClientId(clientId);
  res.json(normalizeResponse(result));
});

export const listChatByUser = asyncHandler(async (req: Request, res: Response) => {
  const { clientId } = chatClientParamSchema.parse({ clientId: req.params.userId });
  const result = await service.listByClientId(clientId);
  res.json(normalizeResponse(result));
});

export const listChatByArea = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await service.listByAreaId(areaId);
  res.json(normalizeResponse(result));
});

export const updateChat = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteChatSchema.parse(req.params);
  const body = updateChatSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  const chatId = Number(result.id);
  if (Number.isFinite(chatId)) {
    broadcastChatMode(chatId, result.mode ?? null);
    broadcastChatSummary({ chatId, mode: result.mode ?? null });
  }
  res.json(normalizeResponse(result));
});

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteChatSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
