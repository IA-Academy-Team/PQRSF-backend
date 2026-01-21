import { IEncuesta } from "../models/encuesta.model";

export type CreateEncuestaDTO = Omit<IEncuesta, "id" | "createdAt">;
export type UpdateEncuestaDTO = Partial<Omit<IEncuesta, "id">> & { id: number };
export type DeleteEncuestaDTO = { id: number };
