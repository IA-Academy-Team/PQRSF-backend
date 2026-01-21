export interface IAnalysis {
  id: number;
  answer: string | null;
  actionTaken: string | null;
  createdAt: Date;
  pqrsId: number;
  responsibleId: number;
}

export type CreateAnalysisDTO = Omit<IAnalysis, "id" | "createdAt">;
export type UpdateAnalysisDTO = Partial<CreateAnalysisDTO> & { id: number };
export type DeleteAnalysisDTO = { id: number };
