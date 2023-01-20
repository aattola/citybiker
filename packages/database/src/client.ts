import { Prisma, PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma:
    | PrismaClient<Prisma.PrismaClientOptions, 'info' | 'warn' | 'error'>
    | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error', 'query']
        : ['error']
  })
export * from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
