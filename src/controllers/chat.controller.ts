import { Request, Response } from "express";
import { CreateChatDTO, UpdateChatDTO } from "../DTOs/chat.dto";
import { ChatService } from "../services/chat.service";
import { asyncHandler, parseBigIntParam } from "./controller.utils";

const service = new ChatService();

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateChatDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getChatById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseBigIntParam(req.params.id, "id");
  const result = await service.findById(id);
  res.json(result);
});

export const listChatByClient = asyncHandler(async (req: Request, res: Response) => {
  const clientId = parseBigIntParam(req.params.clientId, "clientId");
  const result = await service.findByClientId(clientId);
  res.json(result);
});

export const updateChat = asyncHandler(async (req: Request, res: Response) => {
  const id = parseBigIntParam(req.params.id, "id");
  const data = { ...(req.body as UpdateChatDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const id = parseBigIntParam(req.params.id, "id");
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
