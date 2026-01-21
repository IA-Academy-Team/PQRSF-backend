import { IDocumento } from "../models/documento.model";

export type CreateDocumentoDTO = Omit<IDocumento, "id">;
export type UpdateDocumentoDTO = Partial<Omit<IDocumento, "id">> & { id: number };
export type DeleteDocumentoDTO = { id: number };
