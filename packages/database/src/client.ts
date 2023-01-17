import { Prisma, PrismaClient } from '@prisma/client'

declare global {
  var prisma:
    | PrismaClient<Prisma.PrismaClientOptions, 'info' | 'warn' | 'error'>
    | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['info', 'warn', 'error', 'query']
  })
export * from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
