import { IStakeholder } from "../models/IStakeholder";

export type CreateStakeholderDTO = Omit<IStakeholder, "id">;
export type UpdateStakeholderDTO = Partial<Omit<IStakeholder, "id">> & { id: number };
export type DeleteStakeholderDTO = { id: number };
