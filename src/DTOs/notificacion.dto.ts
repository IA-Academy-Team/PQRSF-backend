import { INotificacion } from "../models/INotificacion";

export type CreateNotificacionDTO = Omit<INotificacion, "id" | "createdAt">;
export type UpdateNotificacionDTO = Partial<Omit<INotificacion, "id">> & { id: number };
export type DeleteNotificacionDTO = { id: number };
