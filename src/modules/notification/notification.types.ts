export interface INotification {
  id: number;
  message: string;
  status: number;
  responsibleId: number;
  pqrsId: number;
  createdAt: Date;
}

export type CreateNotificationDTO = Omit<INotification, "id" | "createdAt">;
export type UpdateNotificationDTO = Partial<CreateNotificationDTO> & {
  id: number;
};
export type DeleteNotificationDTO = { id: number };
