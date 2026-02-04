import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QueryResult<T = unknown> = {
  rows: T[];
  rowCount: number;
};

const hasReturningClause = (sql: string) => /\breturning\b/i.test(sql);
const isMutationWithoutReturning = (sql: string) =>
  /^\s*(insert|update|delete)\b/i.test(sql) && !hasReturningClause(sql);

export const prismaPool = {
  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<QueryResult<T>> {
    if (isMutationWithoutReturning(sql)) {
      const affectedRows = await prisma.$executeRawUnsafe(sql, ...params);
      return { rows: [], rowCount: Number(affectedRows ?? 0) };
    }

    const rows = await prisma.$queryRawUnsafe<T[]>(sql, ...params);
    const normalizedRows = Array.isArray(rows) ? rows : [];
    return { rows: normalizedRows, rowCount: normalizedRows.length };
  },
};

