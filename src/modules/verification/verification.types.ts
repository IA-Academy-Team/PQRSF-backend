export interface IVerification {
  id: number;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateVerificationDTO = Omit<
  IVerification,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateVerificationDTO = Partial<CreateVerificationDTO> & {
  id: number;
};
export type DeleteVerificationDTO = { id: number };
