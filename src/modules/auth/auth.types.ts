export interface IRole {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
}

export type CreateRoleDTO = Omit<IRole, "id" | "createdAt">;
export type UpdateRoleDTO = Partial<CreateRoleDTO> & { id: number };
export type DeleteRoleDTO = { id: number };
