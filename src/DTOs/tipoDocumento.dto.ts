import { ITipoDocumento } from "../models/tipoDocumento.model";

export type CreateTipoDocumentoDTO = Omit<ITipoDocumento, "id">;
export type UpdateTipoDocumentoDTO = Partial<Omit<ITipoDocumento, "id">> & { id: number };
export type DeleteTipoDocumentoDTO = { id: number };
