import { CreateNotificacionDTO, DeleteNotificacionDTO, UpdateNotificacionDTO } from "../DTOs/notificacion.dto";
import { INotificacion } from "../models/notificacion.model";
import { NotificacionRepository } from "../repositories/notificacion.repository";
import { ResponsableRepository } from "../repositories/responsable.repository";
import { PqrsRepository } from "../repositories/pqrs.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalPositiveInt,
  optionalString,
  requirePositiveInt,
  requireString,
} from "../utils/validation.utils";

export class NotificacionService {
  constructor(
    private readonly repo = new NotificacionRepository(),
    private readonly responsableRepo = new ResponsableRepository(),
    private readonly pqrsRepo = new PqrsRepository()
  ) {}

  async create(data: CreateNotificacionDTO): Promise<INotificacion> {
    const message = optionalString(data.message, "message");
    if (!message) {
      throw new AppError("message is required", 400, "VALIDATION_ERROR");
    }
    const responsibleId = requirePositiveInt(data.responsibleId, "responsibleId");
    const pqrsId = requirePositiveInt(data.pqrsId, "pqrsId");
    const status = optionalPositiveInt(data.status, "status") ?? 1;
    if (status !== 1 && status !== 2) {
      throw new AppError(
        "status must be 1 (NO_LEIDO) or 2 (LEIDO)",
        400,
        "VALIDATION_ERROR",
        { status }
      );
    }

    ensureFound(
      "Responsable",
      await this.responsableRepo.findById(responsibleId),
      { responsibleId }
    );
    ensureFound("PQRS", await this.pqrsRepo.findById(pqrsId), { pqrsId });

    return this.repo.create({ message, responsibleId, pqrsId, status });
  }

  async findById(id: number): Promise<INotificacion> {
    const notification = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Notification", notification, { id });
  }

  async listByResponsible(responsibleId: number): Promise<INotificacion[]> {
    const id = requirePositiveInt(responsibleId, "responsibleId");
    return this.repo.findByResponsibleId(id);
  }

  async countUnread(responsibleId: number): Promise<number> {
    const id = requirePositiveInt(responsibleId, "responsibleId");
    return this.repo.countUnread(id);
  }

  async markAsRead(ids: number[]): Promise<number> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(
        "ids must be a non-empty array",
        400,
        "VALIDATION_ERROR"
      );
    }
    ids.forEach((id) => requirePositiveInt(id, "id"));
    return this.repo.markAsRead(ids);
  }

  async update(data: UpdateNotificacionDTO): Promise<INotificacion> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["message", "status"], "Notification");

    const status = data.status !== undefined ? requirePositiveInt(data.status, "status") : undefined;
    if (status !== undefined && status !== 1 && status !== 2) {
      throw new AppError(
        "status must be 1 (NO_LEIDO) or 2 (LEIDO)",
        400,
        "VALIDATION_ERROR",
        { status }
      );
    }

    const updated = await this.repo.update({
      id,
      message:
        data.message !== undefined
          ? data.message === null
            ? undefined
            : requireString(data.message, "message")
          : undefined,
      status,
    });
    return ensureFound("Notification", updated, { id });
  }

  async delete(data: DeleteNotificacionDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
