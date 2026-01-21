import { IUsuario } from "../models/usuario.model";

export type CreateUsuarioDTO = Omit<IUsuario, "id" | "createdAt" | "updatedAt">;
export type UpdateUsuarioDTO = Partial<Omit<IUsuario, "id">> & { id: number };
export type DeleteUsuarioDTO = { id: number };
