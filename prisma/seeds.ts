import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.stakeholder.createMany({
    data: [
      { name: "Camper" },
      { name: "Padre de familia" },
      { name: "Empresa de empleabilidad" },
      { name: "Trainer" },
      { name: "Aliado estrategico" },
      { name: "Patrocinador" },
      { name: "Administrativo" },
      { name: "Empresa en Coworking" },
      { name: "Publico en general" },
      { name: "Area interna de Campuslands" },
    ],
    skipDuplicates: true,
  });

  await prisma.typePqrs.createMany({
    data: [
      { name: "Peticion" },
      { name: "Queja" },
      { name: "Reclamo" },
      { name: "Sugerencia" },
      { name: "Felicitacion" },
    ],
    skipDuplicates: true,
  });

  await prisma.pqrsStatus.createMany({
    data: [
      { name: "Radicado" },
      { name: "Analisis" },
      { name: "Reanalisis" },
      { name: "Cerrado" },
    ],
    skipDuplicates: true,
  });

  await prisma.area.createMany({
    data: [
      { name: "Formacion", code: "FOR" },
      { name: "Empleabilidad", code: "EMP" },
      { name: "Administracion", code: "ADM" },
      { name: "Coworking Hubux", code: "HUB" },
      { name: "Talento Humano - Prexxa", code: "THP" },
      { name: "Talent Up", code: "TUP" },
      { name: "Full Services", code: "FUS" },
      { name: "Red Campus", code: "RED" },
      { name: "Camper Star", code: "CST" },
      { name: "Expansion Global", code: "EXP" },
      { name: "Bienestar (Psicologia)", code: "BIE" },
      { name: "IA Academy", code: "IAA" },
      { name: "Clon AI", code: "CLA" },
      { name: "CampusDev", code: "CDV" },
    ],
    skipDuplicates: true,
  });

  await prisma.typePerson.createMany({
    data: [
      { name: "Persona Natural" },
      { name: "Persona Juridica" },
      { name: "Anonimo" },
    ],
    skipDuplicates: true,
  });

  await prisma.typeDocument.createMany({
    data: [
      { name: "Solicitud" },
      { name: "Analisis" },
      { name: "Respuesta" },
      { name: "Evidencia" },
      { name: "Otro" },
    ],
    skipDuplicates: true,
  });

  await prisma.role.createMany({
    data: [{ name: "responsable" }, { name: "admin" }],
    skipDuplicates: true,
  });

  const roles = await prisma.role.findMany({
    where: { name: { in: ["responsable", "admin"] } },
  });
  const roleByName = new Map(roles.map((role: { name: string; id: number; }) => [role.name, role.id]));

  await prisma.user.upsert({
    where: { email: "juan.perez@campuslands.com" },
    create: {
      email: "juan.perez@campuslands.com",
      name: "Juan Perez",
      phoneNumber: "3001112233",
      roleId: roleByName.get("responsable") ?? 1,
      isActive: true,
      emailVerified: true,
    },
    update: {
      name: "Juan Perez",
      phoneNumber: "3001112233",
      roleId: roleByName.get("responsable") ?? 1,
      isActive: true,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin.alvarez@campuslands.com" },
    create: {
      email: "admin.alvarez@campuslands.com",
      name: "Admin Alvarez",
      phoneNumber: "3002223344",
      roleId: roleByName.get("admin") ?? 2,
      isActive: true,
      emailVerified: true,
    },
    update: {
      name: "Admin Alvarez",
      phoneNumber: "3002223344",
      roleId: roleByName.get("admin") ?? 2,
      isActive: true,
      emailVerified: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ["juan.perez@campuslands.com", "admin.alvarez@campuslands.com"],
      },
    },
  });
  const userByEmail = new Map(users.map((user: { email: string; id: number; }) => [user.email, user.id]));

  await prisma.session.createMany({
    data: [
      {
        token: "token-juan",
        userId: userByEmail.get("juan.perez@campuslands.com") ?? 1,
        expiresAt: new Date("2026-12-31T23:59:59.999Z"),
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 ...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        token: "token-admin",
        userId: userByEmail.get("admin.alvarez@campuslands.com") ?? 2,
        expiresAt: new Date("2026-12-31T23:59:59.999Z"),
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 ...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  await prisma.account.createMany({
    data: [
      {
        providerId: "credential",
        providerAccountId: "juan.perez@campuslands.com",
        scope: "openid profile email",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userByEmail.get("juan.perez@campuslands.com") ?? 1,
      },
      {
        providerId: "credential",
        providerAccountId: "admin.alvarez@campuslands.com",
        scope: "openid profile email",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userByEmail.get("admin.alvarez@campuslands.com") ?? 2,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.verification.createMany({
    data: [
      {
        identifier: "juan.perez@campuslands.com",
        value: "123456",
        expiresAt: new Date("2022-12-31T23:59:59.999Z"),
      },
      {
        identifier: "admin.alvarez@campuslands.com",
        value: "654321",
        expiresAt: new Date("2022-12-31T23:59:59.999Z"),
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
