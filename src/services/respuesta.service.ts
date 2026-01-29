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
    const documentId =
      data.documentId === undefined || data.documentId === null
        ? null
        : requirePositiveInt(data.documentId, "documentId");
    const pqrsId = requirePositiveInt(data.pqrsId, "pqrsId");
    const responsibleId = requirePositiveInt(data.responsibleId, "responsibleId");

    if (documentId !== null) {
      ensureFound("Document", await this.documentoRepo.findById(documentId), { documentId });
    }
    const pqrs = ensureFound("PQRS", await this.pqrsRepo.findById(pqrsId), { pqrsId });
    ensureFound(
      "Responsable",
      await this.responsableRepo.findById(responsibleId),
      { responsibleId }
    );

    const existingResponses = await this.repo.findByPqrsId(pqrsId);
    if (existingResponses.length > 0 && ![3, 5].includes(pqrs.pqrsStatusId)) {
      throw new AppError(
        "Response already exists for this PQRS unless it is in reanalysis",
        409,
        "BUSINESS_RULE_VIOLATION",
        { pqrsId, statusId: pqrs.pqrsStatusId }
      );
    }

    const created = await this.repo.create({ content, channel, documentId, pqrsId, responsibleId });

    if (pqrs.pqrsStatusId === 1) {
      await this.pqrsRepo.update({ id: pqrsId, pqrsStatusId: 2 });
    }

    return created;
  }

  async findById(id: number): Promise<IRespuesta> {
    const response = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Response", response, { id });
  }

  async listByPqrsId(pqrsId: number): Promise<IRespuesta[]> {
    const id = requirePositiveInt(pqrsId, "pqrsId");
    return this.repo.findByPqrsId(id);
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

    if (data.documentId !== undefined && data.documentId !== null) {
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
        data.documentId === undefined
          ? undefined
          : data.documentId === null
            ? null
            : requirePositiveInt(data.documentId, "documentId"),
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
