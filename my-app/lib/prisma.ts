// lib/prisma.ts
// Singleton Prisma Client untuk development
// Seperti DB::connection() di Laravel

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'], // Log errors dan warnings
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
