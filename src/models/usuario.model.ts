export interface IUsuario {
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
