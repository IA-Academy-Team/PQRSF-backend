import { CreateRespuestaDTO, DeleteRespuestaDTO, UpdateRespuestaDTO } from "../schemas/respuesta.schema";
import { IRespuesta } from "../models/respuesta.model";
import { RespuestaRepository } from "../repositories/respuesta.repository";
import { DocumentoRepository } from "../repositories/documento.repository";
import { PqrsRepository } from "../repositories/pqrs.repository";
import { ResponsableRepository } from "../repositories/responsable.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalPositiveInt,
  optionalString,
  requirePositiveInt,
  requireString,
} from "../utils/validation.utils";

export class RespuestaService {
  constructor(
    private readonly repo = new RespuestaRepository(),
    private readonly documentoRepo = new DocumentoRepository(),
    private readonly pqrsRepo = new PqrsRepository(),
    private readonly responsableRepo = new ResponsableRepository()
  ) {}

  async create(data: CreateRespuestaDTO): Promise<IRespuesta> {
    const content = requireString(data.content, "content");
    const channel = optionalPositiveInt(data.channel, "channel");
    if (!channel || (channel !== 1 && channel !== 2 && channel !== 3)) {
      throw new AppError(
        "channel must be 1 (EMAIL), 2 (WHATSAPP) or 3 (WEB)",
        400,
        "VALIDATION_ERROR",
        { channel }
      );
    }
    const documentId = requirePositiveInt(data.documentId, "documentId");
    const pqrsId = requirePositiveInt(data.pqrsId, "pqrsId");
    const responsibleId = requirePositiveInt(data.responsibleId, "responsibleId");

    ensureFound("Document", await this.documentoRepo.findById(documentId), { documentId });
    ensureFound("PQRS", await this.pqrsRepo.findById(pqrsId), { pqrsId });
    ensureFound(
      "Responsable",
      await this.responsableRepo.findById(responsibleId),
      { responsibleId }
    );

    return this.repo.create({ content, channel, documentId, pqrsId, responsibleId });
  }

  async findById(id: number): Promise<IRespuesta> {
    const response = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Response", response, { id });
  }

  async update(data: UpdateRespuestaDTO): Promise<IRespuesta> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      ["content", "channel", "documentId", "pqrsId", "responsibleId"],
      "Response"
    );

    if (data.channel !== undefined) {
      const channel = optionalPositiveInt(data.channel, "channel");
      if (!channel || (channel !== 1 && channel !== 2 && channel !== 3)) {
        throw new AppError(
          "channel must be 1 (EMAIL), 2 (WHATSAPP) or 3 (WEB)",
          400,
          "VALIDATION_ERROR",
          { channel }
        );
      }
    }

    if (data.documentId !== undefined) {
      const documentId = requirePositiveInt(data.documentId, "documentId");
      ensureFound("Document", await this.documentoRepo.findById(documentId), { documentId });
    }
    if (data.pqrsId !== undefined) {
      const pqrsId = requirePositiveInt(data.pqrsId, "pqrsId");
      ensureFound("PQRS", await this.pqrsRepo.findById(pqrsId), { pqrsId });
    }
    if (data.responsibleId !== undefined) {
      const responsibleId = requirePositiveInt(data.responsibleId, "responsibleId");
      ensureFound(
        "Responsable",
        await this.responsableRepo.findById(responsibleId),
        { responsibleId }
      );
    }

    const updated = await this.repo.update({
      id,
      content: data.content !== undefined ? requireString(data.content, "content") : undefined,
      channel: data.channel !== undefined ? optionalPositiveInt(data.channel, "channel") : undefined,
      documentId:
        data.documentId !== undefined
          ? requirePositiveInt(data.documentId, "documentId")
          : undefined,
      pqrsId: data.pqrsId !== undefined ? requirePositiveInt(data.pqrsId, "pqrsId") : undefined,
      responsibleId:
        data.responsibleId !== undefined
          ? requirePositiveInt(data.responsibleId, "responsibleId")
          : undefined,
    });
    return ensureFound("Response", updated, { id });
  }

  async delete(data: DeleteRespuestaDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
