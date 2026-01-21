export interface IUser {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
}

export type CreateUserDTO = Omit<IUser, "id" | "createdAt" | "updatedAt">;
export type UpdateUserDTO = Partial<CreateUserDTO> & { id: number };
export type DeleteUserDTO = { id: number };
