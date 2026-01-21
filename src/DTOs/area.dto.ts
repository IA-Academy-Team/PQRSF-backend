import { IArea } from "../models/area.model";

export type CreateAreaDTO = Omit<IArea, "id">;
export type UpdateAreaDTO = Partial<Omit<IArea, "id">> & { id: number };
export type DeleteAreaDTO = { id: number };
