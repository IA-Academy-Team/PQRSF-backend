import { ICuenta } from "../models/ICuenta";

export type CreateCuentaDTO = Omit<ICuenta, "id" | "createdAt" | "updatedAt">;
export type UpdateCuentaDTO = Partial<Omit<ICuenta, "id">> & { id: number };
export type DeleteCuentaDTO = { id: number };
