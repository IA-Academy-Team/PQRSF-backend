export interface IChat {
  id: bigint;
  mode: number | null;
  clientId: bigint | null;
}

export type CreateChatDTO = IChat;
export type UpdateChatDTO = Partial<Omit<IChat, "id">> & { id: bigint };
export type DeleteChatDTO = { id: bigint };
