export interface IResponsible {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  areaId: number | null;
}

export type CreateResponsibleDTO = Omit<IResponsible, "id">;
export type UpdateResponsibleDTO = Partial<CreateResponsibleDTO> & {
  id: number;
};
export type DeleteResponsibleDTO = { id: number };
