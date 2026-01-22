import { CreateDocumentoDTO, DeleteDocumentoDTO, UpdateDocumentoDTO } from "../DTOs/documento.dto";
import { IDocumento } from "../models/documento.model";
import { DocumentoRepository } from "../repositories/documento.repository";
import { TipoDocumentoRepository } from "../repositories/tipoDocumento.repository";
import { PqrsRepository } from "../repositories/pqrs.repository";
import { ensureFound, ensureUpdates, requirePositiveInt, requireString } from "../utils/validation.utils";

export class DocumentoService {
  constructor(
    private readonly repo = new DocumentoRepository(),
    private readonly tipoDocumentoRepo = new TipoDocumentoRepository(),
    private readonly pqrsRepo = new PqrsRepository()
  ) {}

  async create(data: CreateDocumentoDTO): Promise<IDocumento> {
    const url = requireString(data.url, "url");
    const typeDocumentId = requirePositiveInt(data.typeDocumentId, "typeDocumentId");
    const pqrsId = requirePositiveInt(data.pqrsId, "pqrsId");

    ensureFound("TypeDocument", await this.tipoDocumentoRepo.findById(typeDocumentId), {
      typeDocumentId,
    });
    ensureFound("PQRS", await this.pqrsRepo.findById(pqrsId), { pqrsId });

    return this.repo.create({ url, typeDocumentId, pqrsId });
  }

  async findById(id: number): Promise<IDocumento> {
    const doc = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Document", doc, { id });
  }

  async update(data: UpdateDocumentoDTO): Promise<IDocumento> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["url", "typeDocumentId", "pqrsId"], "Document");

    if (data.typeDocumentId !== undefined) {
      const typeDocumentId = requirePositiveInt(data.typeDocumentId, "typeDocumentId");
      ensureFound(
        "TypeDocument",
        await this.tipoDocumentoRepo.findById(typeDocumentId),
        { typeDocumentId }
      );
    }
    if (data.pqrsId !== undefined) {
      const pqrsId = requirePositiveInt(data.pqrsId, "pqrsId");
      ensureFound("PQRS", await this.pqrsRepo.findById(pqrsId), { pqrsId });
    }

    const updated = await this.repo.update({
      id,
      url:
        data.url !== undefined
          ? data.url === null
            ? undefined
            : requireString(data.url, "url")
          : undefined,
      typeDocumentId:
        data.typeDocumentId !== undefined
          ? requirePositiveInt(data.typeDocumentId, "typeDocumentId")
          : undefined,
      pqrsId: data.pqrsId !== undefined ? requirePositiveInt(data.pqrsId, "pqrsId") : undefined,
    });

    return ensureFound("Document", updated, { id });
  }

  async delete(data: DeleteDocumentoDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
