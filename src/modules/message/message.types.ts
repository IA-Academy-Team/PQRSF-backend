export interface IMessage {
  id: number;
  content: string | null;
  type: number | null;
  createdAt: Date;
  chatId: bigint;
}

export type CreateMessageDTO = Omit<IMessage, "id" | "createdAt">;
export type UpdateMessageDTO = Partial<CreateMessageDTO> & { id: number };
export type DeleteMessageDTO = { id: number };
