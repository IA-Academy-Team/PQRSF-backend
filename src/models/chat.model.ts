export interface IChat {
  id: bigint;
  mode: number | null;
  clientId: bigint | null;
}

export interface IChatSummary {
  id: bigint;
  mode: number | null;
  clientId: bigint | null;
  clientName: string | null;
  clientPhone: string | null;
  lastMessage: string | null;
  lastMessageAt: Date | null;
}

export interface IChatPqrsSummary extends IChatSummary {
  pqrsId: number;
  ticketNumber: string;
  statusId: number;
  pqrsCreatedAt: Date;
}
