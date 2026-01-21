import { IVerificacion } from "../models/verificacion.model";

export type CreateVerificacionDTO = Omit<IVerificacion, "id" | "createdAt" | "updatedAt">;
export type UpdateVerificacionDTO = Partial<Omit<IVerificacion, "id">> & { id: number };
export type DeleteVerificacionDTO = { id: number };
