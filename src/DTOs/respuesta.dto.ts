import { IRespuesta } from "../models/IRespuesta";

export type CreateRespuestaDTO = Omit<IRespuesta, "id" | "sentAt">;
export type UpdateRespuestaDTO = Partial<Omit<IRespuesta, "id">> & { id: number };
export type DeleteRespuestaDTO = { id: number };
