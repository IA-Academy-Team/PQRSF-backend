import { ITipoPqrs } from "../models/ITipoPqrs";

export type CreateTipoPqrsDTO = Omit<ITipoPqrs, "id">;
export type UpdateTipoPqrsDTO = Partial<Omit<ITipoPqrs, "id">> & { id: number };
export type DeleteTipoPqrsDTO = { id: number };
