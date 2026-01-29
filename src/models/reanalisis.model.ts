export interface IReanalisis {
  id: number;
  answer: string | null;
  actionTaken: string | null;
  createdAt: Date;
  analysisId: number;
  responsibleId: number;
}
