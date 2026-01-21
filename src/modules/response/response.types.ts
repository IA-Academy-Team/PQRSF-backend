export interface IResponse {
  id: number;
  content: string;
  channel: number;
  sentAt: Date;
  documentId: number;
  pqrsId: number;
  responsibleId: number;
}

export type CreateResponseDTO = Omit<IResponse, "id" | "sentAt">;
export type UpdateResponseDTO = Partial<CreateResponseDTO> & { id: number };
export type DeleteResponseDTO = { id: number };
