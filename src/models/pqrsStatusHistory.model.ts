export interface IPqrsStatusHistory {
  id: number;
  pqrsId: number;
  statusId: number;
  statusName?: string | null;
  createdAt: string;
  note?: string | null;
}
