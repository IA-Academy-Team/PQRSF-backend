import { IPqrs } from "../models/pqrs.model";

export type CreatePqrsDTO = Omit<IPqrs, "id" | "createdAt" | "updatedAt">;
export type UpdatePqrsDTO = Partial<Omit<IPqrs, "id">> & { id: number };
export type DeletePqrsDTO = { id: number };
