export interface ISession {
  id: number;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export type CreateSessionDTO = Omit<ISession, "id" | "createdAt" | "updatedAt">;
export type UpdateSessionDTO = Partial<CreateSessionDTO> & { id: number };
export type DeleteSessionDTO = { id: number };
