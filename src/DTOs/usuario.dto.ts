import { IUsuario } from "../models/IUsuario";

export type CreateUsuarioDTO = Omit<IUsuario, "id" | "createdAt" | "updatedAt">;
export type UpdateUsuarioDTO = Partial<Omit<IUsuario, "id">> & { id: number };
export type DeleteUsuarioDTO = { id: number };
