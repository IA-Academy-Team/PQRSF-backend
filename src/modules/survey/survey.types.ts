export interface ISurvey {
  id: number;
  q1Clarity: number | null;
  q2Timeliness: number | null;
  q3Quality: number | null;
  q4Attention: number | null;
  q5Overall: number | null;
  comment: string | null;
  pqrsId: number;
  createdAt: Date;
}

export type CreateSurveyDTO = Omit<ISurvey, "id" | "createdAt">;
export type UpdateSurveyDTO = Partial<CreateSurveyDTO> & { id: number };
export type DeleteSurveyDTO = { id: number };
