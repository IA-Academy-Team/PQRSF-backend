import { ITipoPersona } from "../models/tipoPersona.model";

export type CreateTipoPersonaDTO = Omit<ITipoPersona, "id">;
export type UpdateTipoPersonaDTO = Partial<Omit<ITipoPersona, "id">> & { id: number };
export type DeleteTipoPersonaDTO = { id: number };
