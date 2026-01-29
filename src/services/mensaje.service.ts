import { CreateMensajeDTO, DeleteMensajeDTO, UpdateMensajeDTO } from "../schemas/mensaje.schema";
import { IMensaje } from "../models/mensaje.model";
import { MensajeRepository } from "../repositories/mensaje.repository";
import { ChatRepository } from "../repositories/chat.repository";
import { PqrsRepository } from "../repositories/pqrs.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalPositiveInt,
  optionalString,
  requireBigInt,
  requirePositiveInt,
} from "../utils/validation.utils";

export class MensajeService {
  constructor(
    private readonly repo = new MensajeRepository(),
    private readonly chatRepo = new ChatRepository(),
    private readonly pqrsRepo = new PqrsRepository()
  ) {}

  async create(data: CreateMensajeDTO): Promise<IMensaje> {
    const chatId = requireBigInt(data.chatId, "chatId");
    ensureFound("Chat", await this.chatRepo.findById(chatId), { chatId });

    const type =
      data.type === null
        ? null
        : data.type !== undefined
        ? optionalPositiveInt(data.type, "type")
        : undefined;
    if (type !== undefined && type !== 1 && type !== 2 && type !== 3) {
      throw new AppError(
        "type must be 1 (CLIENT), 2 (IA) or 3 (ADMIN)",
        400,
        "VALIDATION_ERROR",
        { type }
      );
    }

    return this.repo.create({
      content: optionalString(data.content, "content") ?? null,
      type: type ?? null,
      chatId,
    });
  }

  async findById(id: number): Promise<IMensaje> {
    const msg = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Message", msg, { id });
  }

  async listByChat(chatId: bigint): Promise<IMensaje[]> {
    const id = requireBigInt(chatId, "chatId");
    return this.repo.findByChatId(id);
  }

  async listByChatAndPqrs(chatId: bigint, pqrsId: number): Promise<IMensaje[]> {
    const id = requireBigInt(chatId, "chatId");
    const pqrs = ensureFound(
      "PQRS",
      await this.pqrsRepo.findById(requirePositiveInt(pqrsId, "pqrsId")),
      { pqrsId }
    );
    const chat = ensureFound("Chat", await this.chatRepo.findById(id), { chatId: id });

    if (chat.clientId !== pqrs.clientId) {
      throw new AppError("PQRS does not belong to this chat", 400, "VALIDATION_ERROR", {
        chatId: id,
        pqrsId,
      });
    }

    const endAt = await this.pqrsRepo.findNextCreatedAtByClientId(pqrs.clientId, pqrs.createdAt);
    return this.repo.findByChatIdAndRange(id, pqrs.createdAt, endAt);
  }

  async update(data: UpdateMensajeDTO): Promise<IMensaje> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["content", "type", "chatId"], "Message");

    if (data.chatId !== undefined) {
      const chatId = requireBigInt(data.chatId, "chatId");
      ensureFound("Chat", await this.chatRepo.findById(chatId), { chatId });
    }

    if (data.type !== undefined && data.type !== null) {
      const type = optionalPositiveInt(data.type, "type");
      if (type !== undefined && type !== 1 && type !== 2 && type !== 3) {
        throw new AppError(
          "type must be 1 (CLIENT), 2 (IA) or 3 (ADMIN)",
          400,
          "VALIDATION_ERROR",
          { type }
        );
      }
    }

    const updated = await this.repo.update({
      id,
      content: data.content !== undefined ? optionalString(data.content, "content") : undefined,
      type:
        data.type === null
          ? null
          : data.type !== undefined
          ? optionalPositiveInt(data.type, "type")
          : undefined,
      chatId: data.chatId !== undefined ? requireBigInt(data.chatId, "chatId") : undefined,
    });
    return ensureFound("Message", updated, { id });
  }

  async delete(data: DeleteMensajeDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
