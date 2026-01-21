import { IRespuesta } from "../models/respuesta.model";

export type CreateRespuestaDTO = Omit<IRespuesta, "id" | "sentAt">;
export type UpdateRespuestaDTO = Partial<Omit<IRespuesta, "id">> & { id: number };
export type DeleteRespuestaDTO = { id: number };
