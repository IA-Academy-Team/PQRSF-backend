import { IResponsable } from "../models/IResponsable";

export type CreateResponsableDTO = Omit<IResponsable, "id">;
export type UpdateResponsableDTO = Partial<Omit<IResponsable, "id">> & { id: number };
export type DeleteResponsableDTO = { id: number };
