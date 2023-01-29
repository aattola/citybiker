import { z } from 'zod'
import { PrismaClient, Prisma } from '@citybiker/db'

export const getAllInput = z.object({
  take: z.number().min(1).max(50).default(10),
  cursor: z.string().nullable().optional(),
  orderBy: z
    .object({
      id: z.enum(['asc', 'desc']).default('desc').optional(),
      coveredDistance: z.enum(['asc', 'desc']).default('desc').optional(),
      duration: z.enum(['asc', 'desc']).default('desc').optional()
    })
    .optional()
})

export async function getJourneysWithCursor(
  prisma: PrismaClient,
  input: z.infer<typeof getAllInput>
) {
  console.log(input.orderBy)
  const query: Prisma.JourneyFindManyArgs = {
    skip: 1,
    take: input.take,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    orderBy: input.orderBy ?? { id: 'desc' }
  }

  return prisma.journey.findMany(query)
}
