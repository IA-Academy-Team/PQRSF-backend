import { IRol } from "../models/rol.model";

export type CreateRolDTO = Omit<IRol, "id" | "createdAt">;
export type UpdateRolDTO = Partial<Omit<IRol, "id">> & { id: number };
export type DeleteRolDTO = { id: number };
