import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '../src/config/env.config.ts';

const adapter = new PrismaPg({ 
  connectionString: DATABASE_URL
});

export const prisma = new PrismaClient({ adapter });
export default prisma;
