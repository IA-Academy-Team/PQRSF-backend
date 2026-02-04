import { prisma } from './PrismaClient.ts';

// !hasheo de contraseñas en desarrollo
const SEEDED_PASSWORD_HASHES = {
  test1234: '$2b$10$xKgXgWL17p3iAx4ydjaXq.3WOvjrIVQaMbCbvPPSA/wr7C9PNIdvi',
  admin1234: '$2b$10$joQMs64TpveisyjTlU0BhOvmDev2ZImr4IMoyTGtFsdOzQjnELxjm',
};

async function main() {
  // ==============================
  // Auth / catálogo base
  // ==============================
  await prisma.role.upsert({
    where: { name: 'responsable' },
    update: {},
    create: { name: 'responsable' },
  });
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const responsableRole = await prisma.role.findUniqueOrThrow({
    where: { name: 'responsable' },
  });
  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { name: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'juan.perez@campuslands.com' },
    update: {
      name: 'Juan Perez',
      image: null,
      phoneNumber: '3001112233',
      roleId: responsableRole.id,
      isActive: true,
      emailVerified: true,
    },
    create: {
      email: 'juan.perez@campuslands.com',
      name: 'Juan Perez',
      image: null,
      phoneNumber: '3001112233',
      roleId: responsableRole.id,
      isActive: true,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin.alvarez@campuslands.com' },
    update: {
      name: 'Admin Alvarez',
      image: null,
      phoneNumber: '3002223344',
      roleId: adminRole.id,
      isActive: true,
      emailVerified: true,
    },
    create: {
      email: 'admin.alvarez@campuslands.com',
      name: 'Admin Alvarez',
      image: null,
      phoneNumber: '3002223344',
      roleId: adminRole.id,
      isActive: true,
      emailVerified: true,
    },
  });

  const juan = await prisma.user.findUniqueOrThrow({
    where: { email: 'juan.perez@campuslands.com' },
  });
  const admin = await prisma.user.findUniqueOrThrow({
    where: { email: 'admin.alvarez@campuslands.com' },
  });

  await prisma.session.upsert({
    where: { token: 'token-juan' },
    update: {
      userId: juan.id,
      expiresAt: new Date('2026-12-31T23:59:59.999Z'),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 ...',
      updatedAt: new Date(),
    },
    create: {
      token: 'token-juan',
      userId: juan.id,
      expiresAt: new Date('2026-12-31T23:59:59.999Z'),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 ...',
      updatedAt: new Date(),
    },
  });

  await prisma.session.upsert({
    where: { token: 'token-admin' },
    update: {
      userId: admin.id,
      expiresAt: new Date('2026-12-31T23:59:59.999Z'),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 ...',
      updatedAt: new Date(),
    },
    create: {
      token: 'token-admin',
      userId: admin.id,
      expiresAt: new Date('2026-12-31T23:59:59.999Z'),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 ...',
      updatedAt: new Date(),
    },
  });

  await prisma.account.upsert({
    where: {
      providerId_providerAccountId: {
        providerId: 'credential',
        providerAccountId: 'juan.perez@campuslands.com',
      },
    },
    update: {
      password: SEEDED_PASSWORD_HASHES.test1234,
      scope: 'openid profile email',
      userId: juan.id,
      updatedAt: new Date(),
    },
    create: {
      providerId: 'credential',
      providerAccountId: 'juan.perez@campuslands.com',
      password: SEEDED_PASSWORD_HASHES.test1234,
      scope: 'openid profile email',
      userId: juan.id,
      updatedAt: new Date(),
    },
  });

  await prisma.account.upsert({
    where: {
      providerId_providerAccountId: {
        providerId: 'credential',
        providerAccountId: 'admin.alvarez@campuslands.com',
      },
    },
    update: {
      password: SEEDED_PASSWORD_HASHES.admin1234,
      scope: 'openid profile email',
      userId: admin.id,
      updatedAt: new Date(),
    },
    create: {
      providerId: 'credential',
      providerAccountId: 'admin.alvarez@campuslands.com',
      password: SEEDED_PASSWORD_HASHES.admin1234,
      scope: 'openid profile email',
      userId: admin.id,
      updatedAt: new Date(),
    },
  });

  await prisma.verification.upsert({
    where: {
      identifier_value: {
        identifier: 'juan.perez@campuslands.com',
        value: '123456',
      },
    },
    update: {
      expiresAt: new Date('2022-12-31T23:59:59.999Z'),
      updatedAt: new Date(),
    },
    create: {
      identifier: 'juan.perez@campuslands.com',
      value: '123456',
      expiresAt: new Date('2022-12-31T23:59:59.999Z'),
      updatedAt: new Date(),
    },
  });

  await prisma.verification.upsert({
    where: {
      identifier_value: {
        identifier: 'admin.alvarez@campuslands.com',
        value: '654321',
      },
    },
    update: {
      expiresAt: new Date('2022-12-31T23:59:59.999Z'),
      updatedAt: new Date(),
    },
    create: {
      identifier: 'admin.alvarez@campuslands.com',
      value: '654321',
      expiresAt: new Date('2022-12-31T23:59:59.999Z'),
      updatedAt: new Date(),
    },
  });

  await prisma.stakeholder.createMany({
    data: [
      { name: 'Camper' },
      { name: 'Padre de familia' },
      { name: 'Empresa de empleabilidad' },
      { name: 'Trainer' },
      { name: 'Aliado estratégico' },
      { name: 'Patrocinador' },
      { name: 'Administrativo' },
      { name: 'Empresa en Coworking' },
      { name: 'Público en general' },
      { name: 'Área interna de Campuslands' },
    ],
    skipDuplicates: true,
  });

  await prisma.typePqrs.createMany({
    data: [
      { name: 'Petición' },
      { name: 'Queja' },
      { name: 'Reclamo' },
      { name: 'Sugerencia' },
      { name: 'Felicitación' },
    ],
    skipDuplicates: true,
  });

  await prisma.pqrsStatus.createMany({
    data: [
      { name: 'Radicado' },
      { name: 'Analisis' },
      { name: 'Reanálisis' },
      { name: 'Cerrado' },
      { name: 'Devuelto' },
    ],
    skipDuplicates: true,
  });

  await prisma.area.createMany({
    data: [
      { name: 'Formación', code: 'FOR', description: 'Formación de campuslands' },
      { name: 'Empleabilidad', code: 'EMP', description: 'Empleabilidad de campuslands' },
      { name: 'Administración', code: 'ADM', description: 'Administración de campuslands' },
      { name: 'Coworking Hubux', code: 'HUB', description: 'Coworking Hubux' },
      { name: 'Talento Humano – Prexxa', code: 'THP', description: 'Talento Humano – Prexxa' },
      { name: 'Talent Up', code: 'TUP', description: 'Talent Up' },
      { name: 'Full Services', code: 'FUS', description: 'Full Services' },
      { name: 'Red Campus', code: 'RED', description: 'Red Campus' },
      { name: 'Camper Star', code: 'CST', description: 'Camper Star' },
      { name: 'Expansión Global', code: 'EXP', description: 'Expansión Global' },
      { name: 'Bienestar (Psicología)', code: 'BIE', description: 'Bienestar (Psicología)' },
      { name: 'IA Academy', code: 'IAA', description: 'IA Academy' },
      { name: 'Clon AI', code: 'CLA', description: 'Clon AI' },
      { name: 'CampusDev', code: 'CDV', description: 'CampusDev' },
    ],
    skipDuplicates: true,
  });

  await prisma.typePerson.createMany({
    data: [
      { name: 'Persona Natural' },
      { name: 'Persona Jurídica' },
      { name: 'Anónimo' },
    ],
    skipDuplicates: true,
  });

  await prisma.typeDocument.createMany({
    data: [
      { name: 'Solicitud' },
      { name: 'Análisis' },
      { name: 'Respuesta' },
      { name: 'Evidencia' },
      { name: 'Otro' },
    ],
    skipDuplicates: true,
  });

  // Inserción condicional equivalente al SQL de ejemplo para historial de estados.
  // Solo se inserta si existe la PQRS id=64 y sus estados relacionados.
  const pqrs64 = await prisma.pqrs.findUnique({ where: { id: 64 } });
  if (pqrs64) {
    const now = new Date();
    const withDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const baseRows = [
      { statusId: 1, createdAt: withDays(3) },
      { statusId: 3, createdAt: withDays(2) },
      { statusId: 5, createdAt: withDays(1) },
      { statusId: 3, createdAt: now },
    ];

    for (const row of baseRows) {
      const exists = await prisma.pqrsStatusHistory.findFirst({
        where: {
          pqrsId: 64,
          statusId: row.statusId,
          createdAt: row.createdAt,
        },
      });
      if (!exists) {
        await prisma.pqrsStatusHistory.create({
          data: {
            pqrsId: 64,
            statusId: row.statusId,
            createdAt: row.createdAt,
          },
        });
      }
    }
  }
};

// ejecuta la funciona main de los seeds y manejo de errores
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // despues de cada ejecucion se desconecta de la base de datos
  .finally(() => prisma.$disconnect());
