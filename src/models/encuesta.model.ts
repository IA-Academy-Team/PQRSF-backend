export interface IEncuesta {
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
