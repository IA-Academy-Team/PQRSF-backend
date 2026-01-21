import { ISesion } from "../models/sesion.model";

export type CreateSesionDTO = Omit<ISesion, "id" | "createdAt" | "updatedAt">;
export type UpdateSesionDTO = Partial<Omit<ISesion, "id">> & { id: number };
export type DeleteSesionDTO = { id: number };
