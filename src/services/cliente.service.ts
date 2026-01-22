import { CreateClienteDTO, DeleteClienteDTO, UpdateClienteDTO } from "../DTOs/cliente.dto";
import { ICliente } from "../models/cliente.model";
import { ClienteRepository } from "../repositories/cliente.repository";
import { StakeholderRepository } from "../repositories/stakeholder.repository";
import { TipoPersonaRepository } from "../repositories/tipoPersona.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalEmail,
  optionalString,
  requireBigInt,
  requirePositiveInt,
} from "../utils/validation.utils";

export class ClienteService {
  constructor(
    private readonly repo = new ClienteRepository(),
    private readonly tipoPersonaRepo = new TipoPersonaRepository(),
    private readonly stakeholderRepo = new StakeholderRepository()
  ) {}

  async create(data: CreateClienteDTO): Promise<ICliente> {
    const id = requireBigInt(data.id, "id");
    const email = optionalEmail(data.email, "email") ?? null;
    const phoneNumber = optionalString(data.phoneNumber, "phoneNumber") ?? null;

    if (!email && !phoneNumber) {
      throw new AppError(
        "Either email or phoneNumber is required",
        400,
        "VALIDATION_ERROR"
      );
    }

    if (email) {
      const existing = await this.repo.findByEmail(email);
      if (existing) {
        throw new AppError("Email already exists", 409, "CONFLICT", { email });
      }
    }
    if (phoneNumber) {
      const existing = await this.repo.findByPhoneNumber(phoneNumber);
      if (existing) {
        throw new AppError(
          "Phone number already exists",
          409,
          "CONFLICT",
          { phoneNumber }
        );
      }
    }

    const typePersonId =
      data.typePersonId === undefined || data.typePersonId === null
        ? null
        : requirePositiveInt(data.typePersonId, "typePersonId");
    if (typePersonId) {
      ensureFound(
        "TypePerson",
        await this.tipoPersonaRepo.findById(typePersonId),
        { typePersonId }
      );
    }

    const stakeholderId =
      data.stakeholderId === undefined || data.stakeholderId === null
        ? null
        : requirePositiveInt(data.stakeholderId, "stakeholderId");
    if (stakeholderId) {
      ensureFound(
        "Stakeholder",
        await this.stakeholderRepo.findById(stakeholderId),
        { stakeholderId }
      );
    }

    return this.repo.create({
      id,
      name: optionalString(data.name, "name") ?? null,
      document: optionalString(data.document, "document") ?? null,
      email,
      phoneNumber,
      typePersonId,
      stakeholderId,
    });
  }

  async findById(id: bigint): Promise<ICliente> {
    const client = await this.repo.findById(requireBigInt(id, "id"));
    return ensureFound("Client", client, { id });
  }

  async update(data: UpdateClienteDTO): Promise<ICliente> {
    const id = requireBigInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      ["name", "document", "email", "phoneNumber", "typePersonId", "stakeholderId"],
      "Client"
    );

    if (data.email !== undefined && data.email !== null) {
      const email = optionalEmail(data.email, "email");
      if (email) {
        const existing = await this.repo.findByEmail(email);
        if (existing && existing.id !== id) {
          throw new AppError("Email already exists", 409, "CONFLICT", { email });
        }
      }
    }
    if (data.phoneNumber !== undefined && data.phoneNumber !== null) {
      const phoneNumber = optionalString(data.phoneNumber, "phoneNumber");
      if (phoneNumber) {
        const existing = await this.repo.findByPhoneNumber(phoneNumber);
        if (existing && existing.id !== id) {
          throw new AppError(
            "Phone number already exists",
            409,
            "CONFLICT",
            { phoneNumber }
          );
        }
      }
    }

    if (data.typePersonId !== undefined) {
      const typePersonId =
        data.typePersonId === null
          ? null
          : requirePositiveInt(data.typePersonId, "typePersonId");
      if (typePersonId) {
        ensureFound(
          "TypePerson",
          await this.tipoPersonaRepo.findById(typePersonId),
          { typePersonId }
        );
      }
    }

    if (data.stakeholderId !== undefined) {
      const stakeholderId =
        data.stakeholderId === null
          ? null
          : requirePositiveInt(data.stakeholderId, "stakeholderId");
      if (stakeholderId) {
        ensureFound(
          "Stakeholder",
          await this.stakeholderRepo.findById(stakeholderId),
          { stakeholderId }
        );
      }
    }

    const updated = await this.repo.update({
      ...data,
      id,
      name: data.name !== undefined ? optionalString(data.name, "name") : undefined,
      document: data.document !== undefined ? optionalString(data.document, "document") : undefined,
      email: data.email !== undefined ? optionalEmail(data.email, "email") : undefined,
      phoneNumber:
        data.phoneNumber !== undefined
          ? optionalString(data.phoneNumber, "phoneNumber")
          : undefined,
      typePersonId:
        data.typePersonId !== undefined
          ? data.typePersonId === null
            ? null
            : requirePositiveInt(data.typePersonId, "typePersonId")
          : undefined,
      stakeholderId:
        data.stakeholderId !== undefined
          ? data.stakeholderId === null
            ? null
            : requirePositiveInt(data.stakeholderId, "stakeholderId")
          : undefined,
    });

    return ensureFound("Client", updated, { id });
  }

  async delete(data: DeleteClienteDTO): Promise<boolean> {
    const id = requireBigInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
