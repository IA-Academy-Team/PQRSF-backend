import { IReanalisis } from "../models/IReanalisis";

export type CreateReanalisisDTO = Omit<IReanalisis, "id" | "createdAt">;
export type UpdateReanalisisDTO = Partial<Omit<IReanalisis, "id">> & { id: number };
export type DeleteReanalisisDTO = { id: number };
