export interface IResponsable {
  id: number;
  userId: number;
  areaId: number | null;
}

export interface IResponsableSummary {
  id: number;
  userId: number;
  areaId: number | null;
  userName: string | null;
  userEmail: string | null;
  userIsActive: boolean;
  roleId: number;
  areaName: string | null;
  areaCode: string | null;
}
