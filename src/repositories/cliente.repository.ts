import prisma from "../config/db.config";
import { ICliente } from "../models/cliente.model";
import { CreateClienteDTO, UpdateClienteDTO, DeleteClienteDTO } from "../schemas/cliente.schema";

const clientSelect = {
  id: true,
  name: true,
  document: true,
  email: true,
  phoneNumber: true,
  typePersonId: true,
  stakeholderId: true,
} as const;

const toCliente = (row: {
  id: bigint;
  name: string | null;
  document: string | null;
  email: string | null;
  phoneNumber: string | null;
  typePersonId: number | null;
  stakeholderId: number | null;
}): ICliente => ({
  id: row.id,
  name: row.name,
  document: row.document,
  email: row.email,
  phoneNumber: row.phoneNumber,
  typePersonId: row.typePersonId,
  stakeholderId: row.stakeholderId,
});

export class ClienteRepository {
  private readonly table = "client";

  async create(data: CreateClienteDTO): Promise<ICliente> {
    const created = await prisma.client.create({
      data: {
        id: data.id,
        name: data.name,
        document: data.document,
        email: data.email,
        phoneNumber: data.phoneNumber,
        typePersonId: data.typePersonId,
        stakeholderId: data.stakeholderId,
      },
      select: clientSelect,
    });
    return toCliente(created);
  }

  async findById(id: bigint): Promise<ICliente | null> {
    const found = await prisma.client.findUnique({
      where: { id },
      select: clientSelect,
    });
    return found ? toCliente(found) : null;
  }

  async findAll(): Promise<ICliente[]> {
    const rows = await prisma.client.findMany({
      orderBy: { id: "asc" },
      select: clientSelect,
    });
    return rows.map(toCliente);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ICliente | null> {
    const found = await prisma.client.findFirst({
      where: { phoneNumber },
      select: clientSelect,
    });
    return found ? toCliente(found) : null;
  }

  async findByEmail(email: string): Promise<ICliente | null> {
    const found = await prisma.client.findFirst({
      where: { email },
      select: clientSelect,
    });
    return found ? toCliente(found) : null;
  }

  async update(data: UpdateClienteDTO): Promise<ICliente | null> {
    const updateData: {
      name?: string | null;
      document?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
      typePersonId?: number | null;
      stakeholderId?: number | null;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.document !== undefined) updateData.document = data.document;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.typePersonId !== undefined) updateData.typePersonId = data.typePersonId;
    if (data.stakeholderId !== undefined) updateData.stakeholderId = data.stakeholderId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as bigint);
    }

    const updated = await prisma.client.updateMany({
      where: { id: data.id as bigint },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as bigint);
  }

  async delete(data: DeleteClienteDTO): Promise<boolean> {
    const deleted = await prisma.client.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
