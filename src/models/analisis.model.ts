export interface IAnalisis {
  id: number;
  answer: string | null;
  actionTaken: string | null;
  createdAt: Date;
  pqrsId: number;
  responsibleId: number;
}
