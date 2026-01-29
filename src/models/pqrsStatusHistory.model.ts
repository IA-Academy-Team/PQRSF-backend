export interface IPqrsStatusHistory {
  id: number;
  pqrsId: number;
  statusId: number;
  createdAt: string;
  note?: string | null;
}
