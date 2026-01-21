import { CreateChatDTO, DeleteChatDTO, UpdateChatDTO } from "../DTOs/chat.dto";
import { IChat } from "../models/IChat";
import { ChatRepository } from "../repositories/chat.repository";
import { ClienteRepository } from "../repositories/cliente.repository";
import { AppError } from "../middlewares/error.middleware";
import { ensureFound, ensureUpdates, optionalPositiveInt, requireBigInt } from "../utils/validation.utils";

export class ChatService {
  constructor(
    private readonly repo = new ChatRepository(),
    private readonly clienteRepo = new ClienteRepository()
  ) {}

  async create(data: CreateChatDTO): Promise<IChat> {
    const id = requireBigInt(data.id, "id");
    const clientId = requireBigInt(data.clientId, "clientId");
    const mode =
      data.mode === null
        ? null
        : data.mode !== undefined
        ? optionalPositiveInt(data.mode, "mode")
        : undefined;
    if (mode !== undefined && mode !== 1 && mode !== 2) {
      throw new AppError("mode must be 1 (IA) or 2 (ADMIN)", 400, "VALIDATION_ERROR", { mode });
    }

    ensureFound("Client", await this.clienteRepo.findById(clientId), { clientId });
    const existing = await this.repo.findByClientId(clientId);
    if (existing) {
      throw new AppError("Chat already exists for client", 409, "CONFLICT", { clientId });
    }

    return this.repo.create({
      id,
      clientId,
      mode: mode ?? null,
    });
  }

  async findById(id: bigint): Promise<IChat> {
    const chat = await this.repo.findById(requireBigInt(id, "id"));
    return ensureFound("Chat", chat, { id });
  }

  async findByClientId(clientId: bigint): Promise<IChat> {
    const id = requireBigInt(clientId, "clientId");
    const chat = await this.repo.findByClientId(id);
    return ensureFound("Chat", chat, { clientId: id });
  }

  async update(data: UpdateChatDTO): Promise<IChat> {
    const id = requireBigInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["mode", "clientId"], "Chat");

    if (data.clientId !== undefined) {
      const clientId = requireBigInt(data.clientId, "clientId");
      ensureFound("Client", await this.clienteRepo.findById(clientId), { clientId });
    }
    if (data.mode !== undefined && data.mode !== null) {
      const mode = optionalPositiveInt(data.mode, "mode");
      if (mode !== undefined && mode !== 1 && mode !== 2) {
        throw new AppError("mode must be 1 (IA) or 2 (ADMIN)", 400, "VALIDATION_ERROR", { mode });
      }
    }

    const updated = await this.repo.update({
      id,
      mode:
        data.mode === null
          ? null
          : data.mode !== undefined
          ? optionalPositiveInt(data.mode, "mode")
          : undefined,
      clientId: data.clientId !== undefined ? requireBigInt(data.clientId, "clientId") : undefined,
    });
    return ensureFound("Chat", updated, { id });
  }

  async delete(data: DeleteChatDTO): Promise<boolean> {
    const id = requireBigInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
