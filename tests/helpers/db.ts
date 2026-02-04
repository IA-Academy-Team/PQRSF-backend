import prisma from "../../src/config/db.config";

const TABLES = [
  "pqrs_status_history",
  "notification",
  "survey",
  "response",
  "document",
  "reanalysis",
  "analysis",
  "pqrs",
  "message",
  "chat",
  "client",
  "responsible",
  "accounts",
  "sessions",
  "verifications",
  "users",
  "roles",
  "area",
  "type_document",
  "type_pqrs",
  "pqrs_status",
  "type_person",
  "stakeholder",
];

export const resetDb = async () => {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`);
};

export const seedCatalogs = async () => {
  await prisma.role.createMany({
    data: [{ id: 1, name: "admin", description: "Admin" }],
    skipDuplicates: true,
  });

  await prisma.typePerson.createMany({
    data: [
      { id: 1, name: "Natural" },
      { id: 2, name: "Jurídica" },
      { id: 3, name: "Anónimo" },
    ],
    skipDuplicates: true,
  });

  await prisma.stakeholder.createMany({
    data: [
      { id: 1, name: "Camper" },
      { id: 2, name: "Empresa" },
    ],
    skipDuplicates: true,
  });

  await prisma.typePqrs.createMany({
    data: [
      { id: 1, name: "Petición" },
      { id: 2, name: "Queja" },
      { id: 3, name: "Reclamo" },
      { id: 4, name: "Sugerencia" },
      { id: 5, name: "Felicitación" },
    ],
    skipDuplicates: true,
  });

  await prisma.pqrsStatus.createMany({
    data: [
      { id: 1, name: "Radicado" },
      { id: 2, name: "Analisis" },
      { id: 3, name: "Reanalisis" },
      { id: 4, name: "Cerrado" },
      { id: 5, name: "Devuelto" },
    ],
    skipDuplicates: true,
  });

  await prisma.typeDocument.createMany({
    data: [
      { id: 1, name: "Soporte" },
      { id: 2, name: "Respuesta" },
    ],
    skipDuplicates: true,
  });

  await prisma.area.createMany({
    data: [
      { id: 1, name: "Formación", code: "FOR" },
      { id: 2, name: "Administración", code: "ADM" },
    ],
    skipDuplicates: true,
  });

  return {};
};

export const seedUser = async () => {
  return prisma.user.create({
    data: {
      email: `user${Date.now()}@campuslands.com`,
      name: "Test User",
      roleId: 1,
    },
  });
};

export const seedResponsible = async (areaId = 1) => {
  const user = await seedUser();
  return prisma.responsible.create({
    data: {
      userId: user.id,
      areaId,
    },
  });
};

export const seedClient = async () => {
  return prisma.client.create({
    data: {
      id: BigInt(Date.now()),
      name: "Cliente Test",
      email: `cliente${Date.now()}@mail.com`,
      phoneNumber: `+57${Math.floor(Math.random() * 1000000000)}`,
      typePersonId: 1,
      stakeholderId: 1,
    },
  });
};

export const seedPqrs = async (overrides: Partial<{ statusId: number; areaId: number; typePqrsId: number }> = {}) => {
  const client = await seedClient();
  const pqrs = await prisma.pqrs.create({
    data: {
      ticketNumber: `T-${Date.now()}`,
      description: "Prueba",
      pqrsStatusId: overrides.statusId ?? 1,
      areaId: overrides.areaId ?? 1,
      typePqrsId: overrides.typePqrsId ?? 1,
      clientId: client.id,
      dueDate: new Date(),
      isAutoResolved: false,
    },
  });
  return { client, pqrs };
};
