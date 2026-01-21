import { INotificacion } from "../models/notificacion.model";

export type CreateNotificacionDTO = Omit<INotificacion, "id" | "createdAt">;
export type UpdateNotificacionDTO = Partial<Omit<INotificacion, "id">> & { id: number };
export type DeleteNotificacionDTO = { id: number };
