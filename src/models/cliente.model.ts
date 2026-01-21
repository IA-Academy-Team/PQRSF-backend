export interface ICliente {
  id: bigint;
  name: string | null;
  document: string | null;
  email: string | null;
  phoneNumber: string | null;
  typePersonId: number | null;
  stakeholderId: number | null;
}
