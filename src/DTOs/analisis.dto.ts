import { IAnalisis } from "../models/analisis.model";

export type CreateAnalisisDTO = Omit<IAnalisis, "id" | "createdAt">;
export type UpdateAnalisisDTO = Partial<Omit<IAnalisis, "id">> & { id: number };
export type DeleteAnalisisDTO = { id: number };
