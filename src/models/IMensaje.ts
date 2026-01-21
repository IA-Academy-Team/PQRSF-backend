export interface IMensaje {
  id: number;
  content: string | null;
  type: number | null;
  createdAt: Date;
  chatId: bigint;
}
