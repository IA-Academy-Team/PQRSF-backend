import { IEstadoPqrs } from "../models/estado.model";

export type CreateEstadoPqrsDTO = Omit<IEstadoPqrs, "id">;
export type UpdateEstadoPqrsDTO = Partial<Omit<IEstadoPqrs, "id">> & { id: number };
export type DeleteEstadoPqrsDTO = { id: number };
