export interface INotificacion {
  id: number;
  message: string;
  status: number;
  responsibleId: number;
  pqrsId: number;
  createdAt: Date;
}
