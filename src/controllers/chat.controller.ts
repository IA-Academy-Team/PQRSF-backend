import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  chatClientParamSchema,
  chatIdParamSchema,
  createChatSchema,
  deleteChatSchema,
  updateChatSchema,
} from "../schemas/chat.schema";

const service = new ChatService();

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const data = createChatSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getChatById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = chatIdParamSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const listChats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.list();
  res.json(result);
});

export const listChatByClient = asyncHandler(async (req: Request, res: Response) => {
  const { clientId } = chatClientParamSchema.parse(req.params);
  const result = await service.findByClientId(clientId);
  res.json(result);
});

export const listChatByUser = asyncHandler(async (req: Request, res: Response) => {
  const { clientId } = chatClientParamSchema.parse({ clientId: req.params.userId });
  const result = await service.listByClientId(clientId);
  res.json(result);
});

export const listChatByArea = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await service.listByAreaId(areaId);
  res.json(result);
});

export const updateChat = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteChatSchema.parse(req.params);
  const body = updateChatSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteChatSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
