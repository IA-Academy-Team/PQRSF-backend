export interface IAccount {
  id: number;
  providerId: string;
  providerAccountId: string;
  password: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export type CreateAccountDTO = Omit<IAccount, "id" | "createdAt" | "updatedAt">;
export type UpdateAccountDTO = Partial<CreateAccountDTO> & { id: number };
export type DeleteAccountDTO = { id: number };
