import { IAnalisis } from "../models/IAnalisis";

export type CreateAnalisisDTO = Omit<IAnalisis, "id" | "createdAt">;
export type UpdateAnalisisDTO = Partial<Omit<IAnalisis, "id">> & { id: number };
export type DeleteAnalisisDTO = { id: number };
