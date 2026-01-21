export interface IReanalysis {
  id: number;
  answer: string | null;
  actionTaken: string | null;
  createdAt: Date;
  analysisId: number;
  responsibleId: number;
}

export type CreateReanalysisDTO = Omit<IReanalysis, "id" | "createdAt">;
export type UpdateReanalysisDTO = Partial<CreateReanalysisDTO> & { id: number };
export type DeleteReanalysisDTO = { id: number };
