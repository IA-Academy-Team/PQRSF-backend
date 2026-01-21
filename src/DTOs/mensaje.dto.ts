import { IMensaje } from "../models/IMensaje";

export type CreateMensajeDTO = Omit<IMensaje, "id" | "createdAt">;
export type UpdateMensajeDTO = Partial<Omit<IMensaje, "id">> & { id: number };
export type DeleteMensajeDTO = { id: number };
