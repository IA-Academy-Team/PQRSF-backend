import { IChat } from "../models/IChat";

export type CreateChatDTO = IChat;
export type UpdateChatDTO = Partial<Omit<IChat, "id">> & { id: bigint };
export type DeleteChatDTO = { id: bigint };
